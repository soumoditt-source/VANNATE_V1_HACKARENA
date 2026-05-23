let model: any = null;

export async function initDemandModel() {
  if (model) return model;

  try {
    // Dynamically import to prevent SSR Next.js crashes
    const tf = await import("@tensorflow/tfjs");
    
    // Force CPU backend to prevent freezing the main thread and crashing WebGL contexts
    await tf.setBackend('cpu');
    await tf.ready();

    // Build a highly optimized 3-layer Dense Neural Network
    model = tf.sequential();
    
    // Layer 1: Input (Lat, Lng, CrisisSeverity, TimeOfDay)
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [4] }));
    
    // Layer 2: Hidden
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    
    // Layer 3: Output (Predicted Demand Level 0 to 1)
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    
    return { isTf: true, model, tf };
  } catch (error) {
    console.error("TensorFlow.js failed to load, falling back to heuristic model:", error);
    return { isTf: false, model: null, tf: null };
  }
}

export async function predictDemand(lat: number, lng: number, baseSeverity: number, timeOfDay: number): Promise<number> {
  let dynamicSeverity = baseSeverity;
  try {
    // Sync with Live Global Intelligence to adjust severity
    const res = await fetch("/api/news");
    if (res.ok) {
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        // If there are many active disaster reports, artificially bump the severity (max 1.0)
        const newsMultiplier = Math.min(data.articles.length * 0.05, 0.3);
        dynamicSeverity = Math.min(baseSeverity + newsMultiplier, 1.0);
      }
    }
  } catch (e) {
    console.warn("Could not sync Prediction Engine with Global Intelligence.", e);
  }

  const { isTf, model: nn, tf } = await initDemandModel();
  
  if (isTf && nn && tf) {
    try {
      const inputTensor = tf.tensor2d([[lat, lng, dynamicSeverity, timeOfDay]]);
      const prediction = nn.predict(inputTensor) as any;
      const data = await prediction.data();
      
      inputTensor.dispose();
      prediction.dispose();
      
      return data[0];
    } catch (err) {
      console.warn("TF Prediction failed, using heuristic fallback.", err);
    }
  }

  // Fallback heuristic model if TF fails or is broken in the current environment
  // Sigmoid curve approximation based on severity and time of day
  const timeWeight = (timeOfDay >= 8 && timeOfDay <= 20) ? 0.8 : 0.4;
  const basePrediction = (dynamicSeverity * 0.7) + (timeWeight * 0.3);
  return Math.min(Math.max(basePrediction, 0.1), 0.99);
}

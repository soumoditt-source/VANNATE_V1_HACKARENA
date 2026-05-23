import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

print("Initializing VANNATE Crisis Demand Prediction Model Training Pipeline...")

# 1. Generate Synthetic Crisis Data for Kolkata Region
np.random.seed(42)
num_samples = 5000

print(f"Generating {num_samples} synthetic crisis data points...")
data = {
    'lat': np.random.uniform(22.50, 22.65, num_samples),
    'lng': np.random.uniform(88.30, 88.45, num_samples),
    'danger_level': np.random.uniform(0.0, 1.0, num_samples),
    'time_of_day': np.random.uniform(0, 24, num_samples),
}

# The target variable: supply demand percentage (0 to 1)
# Higher danger = higher demand, night time = slightly higher demand, etc.
demand = (
    0.6 * data['danger_level'] +
    0.2 * np.sin(data['time_of_day'] / 24.0 * np.pi) +
    0.2 * np.random.uniform(0.0, 1.0, num_samples)
)
data['demand'] = np.clip(demand, 0.0, 1.0)

df = pd.DataFrame(data)

# 2. Train-Test Split
X = df[['lat', 'lng', 'danger_level', 'time_of_day']]
y = df['demand']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Train the Model
print("Training RandomForestRegressor model...")
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# 4. Evaluate
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f"Model Training Complete! Mean Squared Error: {mse:.4f}")

# 5. Export Model as .pkl
models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
os.makedirs(models_dir, exist_ok=True)
model_path = os.path.join(models_dir, 'demand_model.pkl')

joblib.dump(model, model_path)
print(f"Serialized model successfully exported to: {model_path}")
print("Ready for deployment.")

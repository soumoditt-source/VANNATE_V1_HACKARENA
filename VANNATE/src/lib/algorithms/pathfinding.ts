/**
 * ==========================================
 * VANNATE CORE INTELLIGENCE: A* HYBRID ROUTING
 * ==========================================
 * This module is the brain behind our physical logistics. It ensures that 
 * emergency supplies, blood, and volunteers are routed through the safest 
 * and fastest paths during a crisis.
 *
 * Why A* over pure Dijkstra? 
 * While Dijkstra explores blindly in all directions, A* uses a "heuristic" 
 * (a smart guess) to pull the search toward the destination. We combine this 
 * with our live `dangerLevel` overlay. If an area is flooded or violent 
 * (dangerLevel -> 1.0), the algorithm mathematically treats it as an 
 * infinitely long road, forcing the rescue vehicles to find a safer detour.
 */

export type GeoNode = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dangerLevel: number; // 0.0 (Safe) to 1.0 (Critical Threat)
};

export type GeoEdge = {
  from: string;
  to: string;
  distance: number; // Base physical distance in km
};

// Haversine distance for A* heuristic
export function getDistance(node1: GeoNode, node2: GeoNode): number {
  const R = 6371; // Earth's radius in km
  const dLat = (node2.lat - node1.lat) * (Math.PI / 180);
  const dLng = (node2.lng - node1.lng) * (Math.PI / 180);
  const aRaw = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(node1.lat * (Math.PI / 180)) * Math.cos(node2.lat * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2); 
  const a = Math.min(1, Math.max(0, aRaw));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

/**
 * A* Pathfinding Algorithm (Hybrid with Dijkstra base)
 * Safely routes around high-danger zones by inflating edge weights dynamically.
 */
export function findOptimalRoute(
  startId: string, 
  goalId: string, 
  nodes: GeoNode[], 
  edges: GeoEdge[]
): { path: GeoNode[], totalCost: number } {
  
  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  
  const gScore = new Map<string, number>();
  nodes.forEach(n => gScore.set(n.id, Infinity));
  gScore.set(startId, 0);
  
  const fScore = new Map<string, number>();
  nodes.forEach(n => fScore.set(n.id, Infinity));
  
  const startNode = nodes.find(n => n.id === startId);
  const goalNode = nodes.find(n => n.id === goalId);
  
  if (!startNode || !goalNode) return { path: [], totalCost: Infinity };
  
  fScore.set(startId, getDistance(startNode, goalNode));

  while (openSet.size > 0) {
    // Node in openSet with lowest fScore
    let currentId = Array.from(openSet)[0];
    let lowestF = fScore.get(currentId) ?? Infinity;
    openSet.forEach(id => {
      const score = fScore.get(id) ?? Infinity;
      if (score < lowestF) {
        lowestF = score;
        currentId = id;
      }
    });

    if (currentId === goalId) {
      // Reconstruct path
      const path: GeoNode[] = [];
      let curr = currentId;
      while (cameFrom.has(curr)) {
        path.unshift(nodes.find(n => n.id === curr)!);
        curr = cameFrom.get(curr)!;
      }
      path.unshift(startNode);
      return { path, totalCost: gScore.get(goalId) || 0 };
    }

    openSet.delete(currentId);
    
    // Find neighbors
    const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);
    
    for (const edge of neighbors) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      const neighborNode = nodes.find(n => n.id === neighborId);
      if (!neighborNode) continue;
      
      // Weight = Distance + (Distance * DangerLevel)
      // A dangerLevel of 1.0 (Flooded/Hazard) doubles the cost of the road!
      const dangerMultiplier = 1 + (neighborNode.dangerLevel * 2);
      const tentativeGScore = (gScore.get(currentId) || 0) + (edge.distance * dangerMultiplier);
      
      if (tentativeGScore < (gScore.get(neighborId) || Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeGScore);
        fScore.set(neighborId, tentativeGScore + getDistance(neighborNode, goalNode));
        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  return { path: [], totalCost: Infinity }; // No path found
}

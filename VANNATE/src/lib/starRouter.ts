/**
 * Vannate Star Router — A* pathfinding over geographic nodes
 * Architecture inspired by Uber's H3 hex-grid routing but adapted
 * for sparse humanitarian crisis node graphs.
 *
 * Usage:
 *   const path = aStarRoute(nodes, "ngo1", "crisis1");
 *   // returns ordered array of nodes forming the optimal route
 */

export type RouteNode = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dangerLevel?: number;
};

/** Haversine great-circle distance in km between two lat/lng points */
function haversine(a: RouteNode, b: RouteNode): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const chord =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

/**
 * A* pathfinding algorithm.
 * Heuristic: Haversine distance to goal.
 * Cost: Haversine distance to neighbour + danger penalty.
 *
 * In a sparse node graph, every node is considered adjacent to every
 * other node within a configurable radius (default 20km).
 */
export function aStarRoute(
  nodes: RouteNode[],
  startId: string,
  goalId: string,
  maxReachKm = 300
): RouteNode[] {
  const nodeMap = new Map<string, RouteNode>(nodes.map((n) => [n.id, n]));
  const start = nodeMap.get(startId);
  const goal = nodeMap.get(goalId);

  if (!start || !goal) return [];

  // Build adjacency (nodes within maxReachKm are neighbours)
  const neighbours = (node: RouteNode): RouteNode[] =>
    nodes.filter(
      (n) => n.id !== node.id && haversine(node, n) <= maxReachKm
    );

  // Priority queue (min-heap simulation via sorted array)
  type QItem = { node: RouteNode; f: number };
  const open: QItem[] = [{ node: start, f: 0 }];
  const gScore = new Map<string, number>([[startId, 0]]);
  const cameFrom = new Map<string, string>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!.node;

    if (current.id === goalId) {
      // Reconstruct path
      const path: RouteNode[] = [];
      let cur = goalId;
      while (cur) {
        path.unshift(nodeMap.get(cur)!);
        cur = cameFrom.get(cur)!;
      }
      return path;
    }

    for (const neighbour of neighbours(current)) {
      const dist = haversine(current, neighbour);
      const dangerPenalty = (neighbour.dangerLevel ?? 0) * 5; // km penalty
      const tentativeG = (gScore.get(current.id) ?? Infinity) + dist + dangerPenalty;

      if (tentativeG < (gScore.get(neighbour.id) ?? Infinity)) {
        cameFrom.set(neighbour.id, current.id);
        gScore.set(neighbour.id, tentativeG);
        const h = haversine(neighbour, goal);
        const f = tentativeG + h;

        const existing = open.find((q) => q.node.id === neighbour.id);
        if (existing) {
          existing.f = f;
        } else {
          open.push({ node: neighbour, f });
        }
      }
    }
  }

  // No path found — return direct line
  return [start, goal];
}

/**
 * Quick-reach score: ranks nodes by combined proximity and low danger.
 * Used for "nearest safe shelter" type lookups.
 */
export function quickReachRank(
  nodes: RouteNode[],
  from: RouteNode,
  topN = 3
): RouteNode[] {
  return [...nodes]
    .filter((n) => n.id !== from.id)
    .map((n) => ({
      node: n,
      score: haversine(from, n) * (1 + (n.dangerLevel ?? 0)),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, topN)
    .map((x) => x.node);
}

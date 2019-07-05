
/**Calculates the relative strength of a GPS signal into "none", "poor", "fair", "good" or "excellent" */
export function calculateGPSStrength(pos?: Position | null): PositionStrength

export type PositionStrength = "none" | "poor" | "fair" | "good" | "excellent"

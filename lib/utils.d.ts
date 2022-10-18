export declare type PositionStrength = "none" | "poor" | "fair" | "good" | "excellent";
export declare function getRelativeLocation(fromLoc: any, toLoc: any): {
    angle: number;
    distance: number;
};
export declare function getCompassBearing(angle: any, T: any): any;
export declare function formatRelativeLocation(relLoc: any, T: any): string;
/** Calculates the relative strength of a GPS signal into "none", "poor", "fair", "good" or "excellent" */
export declare function calculateGPSStrength(pos?: GeolocationPosition | null): PositionStrength;
export declare let formatGPSStrength: (pos: any, T: any) => {
    class: string;
    text: any;
};

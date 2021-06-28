export declare function getRelativeLocation(fromLoc: any, toLoc: any): {
    angle: number;
    distance: number;
};
export declare function getCompassBearing(angle: any, T: any): any;
export declare function formatRelativeLocation(relLoc: any, T: any): string;
export declare function calculateGPSStrength(pos: any): "none" | "excellent" | "good" | "fair" | "poor";
export declare let formatGPSStrength: (pos: any, T: any) => {
    class: string | undefined;
    text: any;
};

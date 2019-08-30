import CurrentPositionFinder, { PositionStatus } from "./CurrentPositionFinder";
import React from "react";
import LocationFinder from "./LocationFinder";
export interface Location {
    latitude: number;
    longitude: number;
    /** Elevation, taking into account mastHeight and depth if present */
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
    /** Height of mast of GPS device (altitude is GPS altitude - mast height - depth) */
    mastHeight?: number;
    /** Depth of pipe or other object (altitude is GPS altitude - mast height - depth) */
    depth?: number;
    /** Method used to set the location */
    method?: "gps" | "map" | "manual";
}
interface Props {
    location?: Location;
    /** Location finder to use */
    locationFinder: LocationFinder;
    onLocationChange: (location: Location | null) => void;
    /** Called if map use is requested */
    onUseMap?: () => void;
    /** Localizer to use */
    T: (str: string, ...args: any[]) => string;
}
interface State {
    /** True if displaying advanced controls */
    displayingAdvanced: boolean;
    /** True if manually entering lat/lng/altitude (only when displayingAdvanced) */
    enteringManual: boolean;
    /** Manual entered Lat (only if enteringManual) */
    manualLat: number | null;
    /** Manual entered Lng (only if enteringManual) */
    manualLng: number | null;
    /** Manual entered Alt (only if enteringManual) */
    manualAlt: number | null;
    /** True when setting via GPS */
    settingUsingGPS: boolean;
    /** Latest status of current position finder (only when settingUsingGPS) */
    positionStatus: PositionStatus | null;
    /** True if displaying success message */
    displayingSuccess: boolean;
    /** True if displaying error message */
    displayingError: boolean;
    /** Mast height that is persisted in local storage */
    mastHeight: number | null;
    /** Depth that is persisted in local storage */
    depth: number | null;
}
/** Component that allows setting of location. Allows either setting from GPS, map or manually entering coordinates
 * Stores mast height and depth in local storage and allows it to be updated.
 */
export default class LocationEditorComponent extends React.Component<Props, State> {
    currentPositionFinder: CurrentPositionFinder;
    /** True when component unmounted */
    unmounted?: boolean;
    constructor(props: Props);
    componentWillUnmount(): void;
    handleClear: () => void;
    handleOpenAdvanced: () => void;
    handleCloseAdvanced: () => void;
    handleEnterManually: () => void;
    handleManualLatChange: (value: number | null) => void;
    handleManualLngChange: (value: number | null) => void;
    handleManualAltChange: (value: number | null) => void;
    handleSaveManual: () => void;
    handleCancelManual: () => void;
    handleMastHeightChange: (value: number | null) => void;
    handleDepthChange: (value: number | null) => void;
    handleSetUsingGPS: () => void;
    handleCancelGPS: () => void;
    handleUseAnyway: () => void;
    handlePositionFound: (pos: Position) => void;
    handlePositionStatus: (positionStatus: PositionStatus) => void;
    handlePositionError: () => void;
    renderLocation(): any;
    renderEnterManually(): any;
    renderMastAndDepth(): any;
    renderAdvanced(): any;
    /** Render the set by GPS display */
    renderSetByGPS(): any;
    renderMessages(): any;
    /** Render left pane with the buttons */
    renderLeftPane(): any;
    renderRightPane(): any;
    render(): any;
}
export {};

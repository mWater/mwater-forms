import React from 'react'
import LocationFinder from './LocationFinder';

export interface Location {
  latitude: number
  longitude: number
  /** Elevation, taking into account mastHeight and depth if present */
  altitude?: number 
  accuracy?: number 
  altitudeAccuracy?: number
  /** Height of mast of GPS device (altitude is GPS altitude - mast height - depth) */
  mastHeight?: number
  /** Depth of pipe or other object (altitude is GPS altitude - mast height - depth) */
  depth?: number
}

/** Component that allows setting of location */
export default class LocationEditorComponent extends React.Component<{
  location?: Location
  /** Optional location finder to use */
  locationFinder?: LocationFinder
  onLocationChange: (location: Location | null) => void
  /** Called if map use is requested */
  onUseMap?: () => void
  T?: (str: string) => string
}> {}
    
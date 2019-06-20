import React from 'react'
import LocationFinder from './LocationFinder';

export interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  altitudeAccuracy?: number
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
    
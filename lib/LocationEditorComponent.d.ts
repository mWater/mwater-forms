import React from 'react'
import LocationFinder from './LocationFinder';

export interface Location {
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  latitude: number
  longitude: number
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
    
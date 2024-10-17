import React from 'react'
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps'

// import {PlaceAutocompleteClassic} from './autocomplete';
import { PlaceSearchBoxClassic } from './searchbox'

type CustomAutocompleteControlProps = {
    controlPosition: ControlPosition
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

export const CustomMapControl = ({
    controlPosition,
    onPlaceSelect,
}: CustomAutocompleteControlProps) => {
    return (
        <MapControl position={controlPosition}>
            <div className="autocomplete-control">
                <PlaceSearchBoxClassic onPlaceSelect={onPlaceSelect} />
            </div>
        </MapControl>
    )
}

import React from 'react'
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps'
import { AutocompleteCustomWithDebounce } from './autocomplete-with-debounce'

// import { PlaceAutocompleteClassic } from './autocomplete'
// alternative function
// import { PlaceSearchBoxClassic } from './searchbox'

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
                <AutocompleteCustomWithDebounce onPlaceSelect={onPlaceSelect} />
            </div>
        </MapControl>
    )
}

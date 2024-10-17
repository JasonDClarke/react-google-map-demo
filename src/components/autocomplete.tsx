// API Price/billing warning - this component uses the Places API to implement autocomplete
// see https://console.cloud.google.com/google/maps-apis/metrics

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { defaultZoom } from '../app'

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceAutocompleteClassic = ({ onPlaceSelect }: Props) => {
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    useEffect(() => {
        if (!places || !inputRef.current) return

        // API Price/billing warning
        // - DO NOT ADD MORE OPTIONS HERE or api will use more expensive $17 per 1000 request places api (because its requesting rich data)
        // these options ore ok for reguler autocomplete which is $2.83 per 1000 requests
        // BUT KEEP THIS FIELDS PARAMETER AS IS
        // See this youtube video to explain
        // https://www.youtube.com/watch?v=VOP8cvCLGac&t=134s
        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        }
        // API Price/billing warning - this component uses the Places API to implement autocomplete
        // see https://console.cloud.google.com/google/maps-apis/metrics
        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
    }, [places])

    useEffect(() => {
        if (!placeAutocomplete) return

        placeAutocomplete.addListener('place_changed', () => {
            const place = placeAutocomplete.getPlace()
            handlePlaceChanged(place)
            onPlaceSelect(place)
        })
    }, [onPlaceSelect, placeAutocomplete])

    const map = useMap()
    const handlePlaceChanged = useCallback(
        (place: google.maps.places.PlaceResult | null) => {
            if (!map) return
            if (!place?.geometry?.location) return
            console.log('place selected: ', place.geometry.location.toString())

            if (map.getZoom() === defaultZoom) {
                map.panTo(place.geometry.location)
            } else {
                map.moveCamera({
                    zoom: defaultZoom,
                    center: place.geometry.location,
                })
            }
        },
        [map]
    )

    return (
        <div className="autocomplete-container">
            <input ref={inputRef} />
        </div>
    )
}

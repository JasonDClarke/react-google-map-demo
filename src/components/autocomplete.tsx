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

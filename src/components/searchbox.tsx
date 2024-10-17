// API Price/billing warning - this component uses the Places API to implement autocomplete
// see https://console.cloud.google.com/google/maps-apis/metrics

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { defaultZoom } from '../app'

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

// This is an example of the classic "Place SearchBox" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceSearchBoxClassic = ({ onPlaceSelect }: Props) => {
    const [placeSearchBox, setPlaceSearchBox] =
        useState<google.maps.places.SearchBox | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    useEffect(() => {
        if (!places || !inputRef.current) return

        // API Price/billing warning - this component uses the Places API to implement autocomplete
        // see https://console.cloud.google.com/google/maps-apis/metrics
        setPlaceSearchBox(new places.SearchBox(inputRef.current))
    }, [places])

    useEffect(() => {
        if (!placeSearchBox) return

        placeSearchBox.addListener('places_changed', () => {
            const place = placeSearchBox.getPlaces()?.[0]
            if (place) {
                console.log(place)
                handlePlaceChanged(place)
                onPlaceSelect(place)
            }
        })
    }, [onPlaceSelect, placeSearchBox])

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

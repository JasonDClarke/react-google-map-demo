import React, { useEffect, useState, useCallback } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import Combobox from 'react-widgets/Combobox'

import 'react-widgets/styles.css'
import { useDebounce } from 'use-debounce'
import { defaultZoom } from '../app'

// API billing optimizations
const debounceTime = 1000
const autocompleteMinimumLength = 2

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

// This uses the Combobox from "react-widgets" (https://jquense.github.io/react-widgets/docs/Combobox)
export const AutocompleteCustomHybrid = ({ onPlaceSelect }: Props) => {
    const map = useMap()
    const places = useMapsLibrary('places')

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
    const [sessionToken, setSessionToken] =
        useState<google.maps.places.AutocompleteSessionToken>()

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
    const [autocompleteService, setAutocompleteService] =
        useState<google.maps.places.AutocompleteService | null>(null)

    // https://developers.google.com/maps/documentation/javascript/reference/places-service
    const [placesService, setPlacesService] =
        useState<google.maps.places.PlacesService | null>(null)

    const [predictionResults, setPredictionResults] = useState<
        Array<google.maps.places.AutocompletePrediction>
    >([])

    const [inputValue, setInputValue] = useState<string>('')
    // debounce
    const [debouncedValue] = useDebounce(inputValue, debounceTime)

    const [fetchingData, setFetchingData] = useState<boolean>(false)

    useEffect(() => {
        if (!places || !map) return

        setAutocompleteService(new places.AutocompleteService())
        setPlacesService(new places.PlacesService(map))
        setSessionToken(new places.AutocompleteSessionToken())

        return () => setAutocompleteService(null)
    }, [map, places])

    const fetchPredictions = useCallback(
        async (inputValue: string) => {
            if (!autocompleteService || !inputValue) {
                return
            }

            setFetchingData(true)

            const request = { input: inputValue, sessionToken }
            const response =
                await autocompleteService.getPlacePredictions(request)

            setPredictionResults(response.predictions)
            setFetchingData(false)
        },
        [autocompleteService, sessionToken]
    )

    const onInputChange = (
        value: google.maps.places.AutocompletePrediction | string
    ) => {
        if (typeof value === 'string') {
            setInputValue(value)
        }
    }

    const onDebouncedInputChange = useCallback(
        (debouncedValue) => {
            fetchPredictions(debouncedValue)
        },
        [fetchPredictions]
    )

    useEffect(() => {
        if (debouncedValue.length >= autocompleteMinimumLength) {
            onDebouncedInputChange(debouncedValue)
        }
    }, [debouncedValue])

    const onSelect = useCallback(
        (prediction: google.maps.places.AutocompletePrediction | string) => {
            if (!places || typeof prediction === 'string') return

            setFetchingData(true)

            const detailRequestOptions = {
                placeId: prediction.place_id,
                fields: ['geometry', 'name', 'formatted_address'],
                sessionToken,
            }

            const detailsRequestCallback = (
                placeDetails: google.maps.places.PlaceResult | null
            ) => {
                onPlaceSelect(placeDetails)
                setInputValue(placeDetails?.formatted_address ?? '')
                setSessionToken(new places.AutocompleteSessionToken())
                // Code for updating map
                if (!map) return
                if (!placeDetails?.geometry?.location) return
                console.log(
                    'place selected: ',
                    placeDetails.geometry.location.toString()
                )

                if (map.getZoom() === defaultZoom) {
                    map.panTo(placeDetails.geometry.location)
                } else {
                    map.moveCamera({
                        zoom: defaultZoom,
                        center: placeDetails.geometry.location,
                    })
                }
                setFetchingData(false)
            }

            placesService?.getDetails(
                detailRequestOptions,
                detailsRequestCallback
            )
        },
        [onPlaceSelect, places, placesService, sessionToken]
    )

    return (
        <div className="autocomplete-container">
            <Combobox
                placeholder="Search for a place"
                data={predictionResults}
                dataKey="place_id"
                textField="description"
                value={inputValue}
                onChange={onInputChange}
                onSelect={onSelect}
                busy={fetchingData}
                // Since the Autocomplete Service API already returns filtered results
                // always want to display them all.
                filter={() => true}
                focusFirstItem={true}
                hideEmptyPopup
                hideCaret
            />
        </div>
    )
}

import React, { useEffect, useState, useCallback, FormEvent } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { defaultZoom } from '../app'
import './autocomplete-with-debounce.css'
import { useDebounce } from 'use-debounce'

// API billing optimizations
const debounceTime = 1000
const autocompleteMinimumLength = 2

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustomWithDebounce = ({ onPlaceSelect }: Props) => {
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
                setPredictionResults([])
                return
            }

            const request = { input: inputValue, sessionToken }
            const response =
                await autocompleteService.getPlacePredictions(request)

            setPredictionResults(response.predictions)
        },
        [autocompleteService, sessionToken]
    )

    const onInputChange = (event: FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement)?.value

        setInputValue(value)
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

    const handleSuggestionClick = useCallback(
        (placeId: string) => {
            if (!places) return

            const detailRequestOptions = {
                placeId,
                fields: ['geometry', 'name', 'formatted_address'],
                sessionToken,
            }

            const detailsRequestCallback = (
                placeDetails: google.maps.places.PlaceResult | null
            ) => {
                onPlaceSelect(placeDetails)
                setPredictionResults([])
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
            <input
                value={inputValue}
                onInput={(event: FormEvent<HTMLInputElement>) =>
                    onInputChange(event)
                }
                placeholder="Search for a place"
            />

            {predictionResults.length > 0 && (
                <ul className="custom-list">
                    {predictionResults.map(({ place_id, description }) => {
                        return (
                            <li
                                key={place_id}
                                className="custom-list-item"
                                onClick={() => handleSuggestionClick(place_id)}
                            >
                                {description}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

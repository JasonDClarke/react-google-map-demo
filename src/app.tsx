/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{
    /* // API Price/billing warning - this file uses the Maps Javascript API when rendering the map
  // see https://console.cloud.google.com/google/maps-apis/metrics */
}

import React, { useEffect, useState, useRef, useCallback } from 'react'
import './font-face.css'
import './app.css'
import { createRoot } from 'react-dom/client'

import {
    APIProvider,
    Map,
    useMap,
    AdvancedMarker,
    MapCameraChangedEvent,
    ControlPosition,
    Pin,
} from '@vis.gl/react-google-maps'

import { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { Marker } from '@googlemaps/markerclusterer'

import { CustomMapControl } from './components/map-control'

import { locations } from './locationData/locations'
import { ChurchData } from './components/church-data'
import { apiKey } from './apiKey'

type Poi = { key: string; location: google.maps.LatLngLiteral }

export const defaultZoom = 13

// Wrap the Geolocation API in a Promise
function getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        } else {
            reject(new Error('Geolocation is not supported by this browser.'))
        }
    })
}

const App = () => {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null)
    useEffect(() => {
        const location = selectedPlace?.geometry?.location
        if (!location) return
        const center = { lat: location.lat(), lng: location.lng() }
        setCenter(center)
    }, [selectedPlace])

    // React state to hold the coordinates
    const [coordinates, setCoordinates] =
        useState<google.maps.LatLngLiteral | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const position = await getPosition()
                const lat = position.coords.latitude
                const lng = position.coords.longitude

                // Update state with coordinates
                setCoordinates({ lat, lng })
            } catch (err) {
                setError('Error retrieving location')
                console.error(err)
            }
        }

        fetchCoordinates()
    }, [])

    const defaultCenter = { lat: 51.5138455, lng: -0.0983506 } // st pauls
    const [center, setCenter] =
        useState<google.maps.LatLngLiteral>(defaultCenter)

    return (
        <APIProvider
            apiKey={apiKey}
            onLoad={() => console.log('Maps API has loaded.')}
        >
            <section className="wrapper">
                {/* // API Price/billing warning - this component uses the Maps Javascript API when rendering the map
                // see https://console.cloud.google.com/google/maps-apis/metrics */}
                {(coordinates || error) && (
                    <Map
                        defaultZoom={defaultZoom}
                        defaultCenter={coordinates || defaultCenter}
                        onCameraChanged={(ev: MapCameraChangedEvent) => {
                            // WARNING setting (eg center useState state here slows down performance of dragging significantly)
                            console.log(
                                'camera changed:',
                                ev.detail.center,
                                'zoom:',
                                ev.detail.zoom
                            )
                            // setCenter(ev.detail.center)
                        }}
                        mapId="da37f3254c6a6d1c"
                    >
                        <PoiMarkers pois={locations} setCenter={setCenter} />
                        <CustomMapControl
                            controlPosition={ControlPosition.TOP}
                            onPlaceSelect={setSelectedPlace}
                        />
                    </Map>
                )}
                <div className="sidebar">
                    <ChurchData center={center} />
                </div>
            </section>
        </APIProvider>
    )
}

const PoiMarkers = (props: {
    pois: Poi[]
    setCenter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>
}) => {
    const map = useMap()
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({})
    const clusterer = useRef<MarkerClusterer | null>(null)
    const handleClick = useCallback(
        (ev: google.maps.MapMouseEvent) => {
            if (!map) return
            if (!ev.latLng) return
            console.log('marker clicked: ', ev.latLng.toString())
            if (map.getZoom() === defaultZoom) {
                map.panTo(ev.latLng)
            } else {
                map.moveCamera({ zoom: defaultZoom, center: ev.latLng })
            }
            props.setCenter({ lat: ev.latLng.lat(), lng: ev.latLng.lng() })
        },
        [map]
    )
    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        if (!map) return
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map })
        }
    }, [map])

    // Update markers, if the markers array has changed
    useEffect(() => {
        clusterer.current?.clearMarkers()
        clusterer.current?.addMarkers(Object.values(markers))
    }, [markers])

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return
        if (!marker && !markers[key]) return

        setMarkers((prev) => {
            if (marker) {
                return { ...prev, [key]: marker }
            } else {
                const newMarkers = { ...prev }
                delete newMarkers[key]
                return newMarkers
            }
        })
    }

    return (
        <>
            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={(marker) => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={handleClick}
                >
                    <Pin
                        background={'#FBBC04'}
                        glyphColor={'#000'}
                        borderColor={'#000'}
                    />
                </AdvancedMarker>
            ))}
        </>
    )
}

export default App

const root = createRoot(document.getElementById('app'))
root.render(<App />)

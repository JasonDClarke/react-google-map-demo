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

import {
    defaultOnClusterClickHandler,
    MarkerClusterer,
} from '@googlemaps/markerclusterer'
import type { Marker } from '@googlemaps/markerclusterer'

import { CustomMapControl } from './components/map-control'

import { locations } from './locationData/locations'
import { ChurchData } from './components/church-data'
import { haversine } from './distanceUtils/haversine'

// @ts-expect-error vite env variable
const env = await import.meta.env

const apiKey = env.VITE_GOOGLE_MAPS_API_KEY // Get an API Key on https://myprojects.geoapify.com

type Poi = { key: string; location: google.maps.LatLngLiteral }

export const defaultZoom = 11
// toggle to increase performance at cost of losing global markers
// eg 50 would only render markers within 50 miles
const markerRadiusLimit = null as number | null

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
                setCenter({ lat, lng })
            } catch (err) {
                setError('Error retrieving location')
                console.error(err)
            }
        }

        fetchCoordinates()
    }, [])

    const fallbackCenter = { lat: 51.5138455, lng: -0.0983506 } // st pauls
    const [center, setCenter] =
        useState<google.maps.LatLngLiteral>(fallbackCenter)

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
                        mapTypeControlOptions={{
                            position: ControlPosition.BOTTOM_CENTER,
                        }}
                        defaultZoom={defaultZoom}
                        defaultCenter={coordinates || fallbackCenter}
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
                        <PoiMarkers
                            pois={locations}
                            setCenter={setCenter}
                            center={center}
                        />
                        <CustomMapControl
                            controlPosition={ControlPosition.TOP_CENTER}
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
    center: google.maps.LatLngLiteral
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
            const onClusterClickHandler = (e, cluster, map) => {
                // YOUR CODE HERE
                defaultOnClusterClickHandler(e, cluster, map)
                props.setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
            clusterer.current = new MarkerClusterer({
                map,
                onClusterClick: onClusterClickHandler,
            })
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
            {props.pois.map((poi: Poi) => {
                let background = '#FBBC04'
                if (haversine(poi.location, props.center) <= 5) {
                    background = '#00FF00'
                }

                // performance toggle
                if (
                    markerRadiusLimit &&
                    haversine(poi.location, props.center) >= markerRadiusLimit
                ) {
                    return null
                }

                return (
                    <AdvancedMarker
                        key={poi.key}
                        position={poi.location}
                        ref={(marker) => setMarkerRef(marker, poi.key)}
                        clickable={true}
                        onClick={handleClick}
                    >
                        <Pin
                            background={background}
                            glyphColor={'#000'}
                            borderColor={'#000'}
                        />
                    </AdvancedMarker>
                )
            })}
        </>
    )
}

export default App

const root = createRoot(document.getElementById('app'))
root.render(<App />)

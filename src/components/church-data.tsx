import React from 'react'
import {
    filterAndSortByDistance,
    sortByDistance,
} from '../distanceUtils/filterSortByDistance'
import { churchData } from '../locationData/fullData'

import { useMap } from '@vis.gl/react-google-maps'
import { haversine } from '../distanceUtils/haversine'

export const ChurchData = ({
    center,
}: {
    center: google.maps.LatLngLiteral
}) => {
    const map = useMap()
    if (!map) return

    let locations = filterAndSortByDistance(churchData, center)
    let fiveMileWarning = false
    if (!locations.length) {
        fiveMileWarning = true
        locations = sortByDistance(churchData, center).slice(0, 1)
    }

    return (
        <div>
            {fiveMileWarning && (
                <div>
                    Sorry, no locations found within 5 miles of search. Here is
                    the closest location.
                </div>
            )}
            {locations.map((location) => {
                const distance = haversine(location, center)

                return (
                    <div key={location.key}>
                        <h2>{location['Name']}</h2>

                        <p>Distance: {distance.toFixed(1)} miles</p>

                        <p>{location['Address']}</p>
                        <p>{location['ZipCode']}</p>
                        <p>{location['Country']}</p>
                    </div>
                )
            })}
        </div>
    )
}

import React from 'react'
import { filterAndSortByDistance } from '../distanceUtils/filterSortByDistance'
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

    const locations = filterAndSortByDistance(churchData, center)

    if (!locations.length) {
        return <div>Sorry, no locations found within 5 miles of search</div>
    }

    return (
        <div>
            {filterAndSortByDistance(churchData, center).map((location) => {
                const distance = haversine(location, center)

                return (
                    <div key={location.key}>
                        <h2>{location['Church or Organisation']}</h2>
                        <h3>{location['Course start date']}</h3>

                        <p>Distance: {distance.toFixed(1)} miles</p>

                        <p>{location['Church Address']}</p>
                        <p>{location['Church Postcode / ZIP Code']}</p>
                        <p>{location['Location / City']}</p>
                        <p>{location['Church Country']}</p>

                        <p>Contact:</p>
                        <p>{location['First & Last Name']}</p>
                        <p>{location['Church Contact number / email']}</p>
                        <p>{location['Church Website URL']}</p>

                        <p>Notes:</p>
                        <p>{location.Notes}</p>
                    </div>
                )
            })}
        </div>
    )
}

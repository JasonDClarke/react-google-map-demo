import { AugmentedChurchSuiteData } from '../locationData/types'
import { haversine } from './haversine'

// Utility function to filter and sort an array of locations within 5 miles
export const filterAndSortByDistance = (
    locations: AugmentedChurchSuiteData[],
    center: google.maps.LatLngLiteral
): AugmentedChurchSuiteData[] => {
    return locations
        .filter((location) => haversine(center, location) <= 5) // Filter within 5 miles
        .sort((a, b) => haversine(center, a) - haversine(center, b)) // Sort closest first
}

export const sortByDistance = (
    locations: AugmentedChurchSuiteData[],
    center: google.maps.LatLngLiteral
): AugmentedChurchSuiteData[] => {
    return locations.sort((a, b) => haversine(center, a) - haversine(center, b)) // Sort closest first
}

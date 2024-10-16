const toRadians = (degrees: number): number => degrees * (Math.PI / 180)

// Haversine formula for working out distance from coordinates
export const haversine = (
    { lat: lat1, lng: lon1 }: google.maps.LatLngLiteral,
    { lat: lat2, lng: lon2 }: google.maps.LatLngLiteral
): number => {
    const R = 3959 // Earth's radius in miles

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in miles
}

// Example usage:
// const london: LatLng = { lat: 51.5074, lng: -0.1278 }; // Coordinates of London
// const newYork: LatLng = { lat: 40.7128, lng: -74.0060 }; // Coordinates of New York

// const distance = haversine(london, newYork);
// console.log(`Distance: ${distance} miles`);

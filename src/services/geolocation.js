export function getDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is unavailable in this browser. Search for a city instead.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        id: `location:${coords.latitude}:${coords.longitude}`,
        source: 'geolocation',
        name: 'Your location',
        latitude: coords.latitude,
        longitude: coords.longitude,
        country: '',
        admin1: '',
      }),
      (error) => {
        const messages = {
          1: 'Location access was denied. Allow it in your browser settings or search for a city.',
          2: 'Your location could not be determined. Try again or search for a city.',
          3: 'Finding your location took too long. Try again or search for a city.',
        }
        reject(new Error(messages[error.code] || 'Could not get your location. Please try again.'))
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  })
}

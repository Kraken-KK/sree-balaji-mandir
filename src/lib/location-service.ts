
export interface LocationData {
  latitude: number;
  longitude: number;
  country: string;
  isInIndia: boolean;
}

export const requestLocationPermission = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get country
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location data');
          }
          
          const data = await response.json();
          const country = data.countryCode || '';
          const isInIndia = country.toUpperCase() === 'IN';
          
          resolve({
            latitude,
            longitude,
            country,
            isInIndia
          });
        } catch (error) {
          console.error('Error getting location data:', error);
          // Fallback: assume not in India if we can't determine
          resolve({
            latitude,
            longitude,
            country: 'UNKNOWN',
            isInIndia: false
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(new Error('Unable to retrieve your location'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

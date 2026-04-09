import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/stores/locationStore';

export function useLocation() {
  const { lat, lng, hasPermission, setLocation, setPermission, setLoading } = useLocationStore();

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status === 'granted');
    return status === 'granted';
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location.coords.latitude, location.coords.longitude, location.coords.accuracy ?? undefined);
      return { lat: location.coords.latitude, lng: location.coords.longitude };
    } finally {
      setLoading(false);
    }
  };

  return { lat, lng, hasPermission, requestPermission, getCurrentLocation };
}

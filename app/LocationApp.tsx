import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const LocationApp: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const router = useRouter();

  // Set the target location (e.g., Anthropic's office)
  const targetLatitude = 6.673175;
  const targetLongitude = -1.565423;
  const distanceThreshold = 1000; // 1 kilometer

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c; // Radius of the earth in kilometers
  }, []);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      // Calculate the distance between the user's location and the target location
      const newDistance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        targetLatitude,
        targetLongitude
      );
      setDistance(newDistance);

      // Check if the user is in or close to the target location
      if (newDistance <= distanceThreshold) {
        router.replace('/Verify');
      } else {
        Alert.alert('Location Alert', 'You are outside the school range!');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, [calculateDistance, targetLatitude, targetLongitude, distanceThreshold, router]);

  useEffect(() => {
    const interval = setInterval(getLocation, 60000); // Check location every 60 seconds (1 minute)
    return () => clearInterval(interval);
  }, [getLocation]);

  const DistanceDisplay: React.FC<{ distance: number }> = ({ distance }) => (
    <Text style={styles.distance}>Distance from target: {distance.toFixed(2)} km</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location</Text>
      {latitude !== null && longitude !== null ? (
        <View>
          <Text style={styles.location}>
            Latitude: {latitude.toFixed(4)}
          </Text>
          <Text style={styles.location}>
            Longitude: {longitude.toFixed(4)}
          </Text>
          {distance !== null && (
            <DistanceDisplay distance={distance} />
          )}
          {distance !== null && distance <= distanceThreshold ? (
            <Text style={styles.close}>You are close to the target location!</Text>
          ) : (
            <Text style={styles.far}>You are not close to the target location.</Text>
          )}
        </View>
      ) : (
        <Text style={styles.location}>Checking your location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  location: {
    fontSize: 18,
    marginVertical: 5,
  },
  distance: {
    fontSize: 18,
    marginVertical: 5,
    color: '#888',
  },
  close: {
    fontSize: 18,
    marginVertical: 5,
    color: 'green',
  },
  far: {
    fontSize: 18,
    marginVertical: 5,
    color: 'red',
  },
});

export default LocationApp;

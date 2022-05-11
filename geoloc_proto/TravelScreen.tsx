import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import stations from './liste-des-gares.json';


function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

const GeolocScreen = (props: any) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({ latitude: 48.856614, longitude: 2.3522219, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  const [userLocation, setUserLocation] = useState<null | LatLng>(null);
  const [closestStation, setClosestStaion] = useState<any>(null);

  const GetClosestStation = async () => {
    if (userLocation === null)
      return;
    const stationArr: Array<any> = stations;
    let idx = -1;
    let closest = 9999999999;
    let i = 0;
    for (i = 0; i < stationArr.length; i++) {
      let val = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude,
        stationArr[i]["fields"]["geo_point_2d"][0], stationArr[i]["fields"]["geo_point_2d"][1])
      if (val < closest) {
        closest = val;
        idx = i;
      }
    }
    if (idx !== -1) {
      setClosestStaion({
        latitude: stationArr[idx]["fields"]["geo_point_2d"][0],
        longitude: stationArr[idx]["fields"]["geo_point_2d"][1],
        name: stationArr[idx]["fields"]["libelle"],
        distance: closest
      })
    }
  }

  useEffect(() => {
    (async () => {
      if (userLocation !== null)
        return;
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      if (mapRef.current !== null)
        mapRef.current.animateToRegion({ ...location.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 })
      else setRegion({ ...location.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      GetClosestStation();
    })();
  });

  return (
    <View style={{ flex: 1 }}>
      <Text>offset</Text>
      <Text>offset</Text>
      <Text>offset</Text>
      <Text>offset</Text>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation={true}
        onUserLocationChange={({ nativeEvent }) => {
          const location = { ...nativeEvent.coordinate };

          if (userLocation !== null) {
            setUserLocation(location);
            GetClosestStation();
            return;
          }
          setUserLocation(location);
          if (mapRef.current !== null)
            mapRef.current.animateToRegion({ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 })
          else setRegion({ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        }}
        ref={mapRef}
        onRegionChange={(region) => setRegion(region)}
      >
      </MapView>
      <Text>{closestStation !== null ? `Station la plus proche: ${closestStation.name} à ${Math.round(closestStation.distance)}m` : "Aucun résultat "}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  goToSearchButon: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 5,
    height: 50,
    overflow: 'hidden'
  },
  goBackButton: {
    color: 'blue',
    marginHorizontal: 10,
    marginTop: 2
  },
});

export default GeolocScreen;
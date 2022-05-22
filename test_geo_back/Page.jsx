import * as React from "react";
import {
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

import stations from './liste-des-gares.json';

const STATUSBAR_HEIGHT = Platform.OS === "os" ? 20 : StatusBar.currentHeight;
const LOCATION_TASK_NAME = "background-location-task";

export default function TestingGround({ navigation }) {
  const onPress = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 10000,
        foregroundService: {
          notificationTitle: "BackgroundLocation Is On",
          notificationBody: "We are tracking your location",
          notificationColor: "#ffce52",
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          height: 50,
          width: 300,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <Text>Enable background location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: STATUSBAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});


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

const GetClosestStation = async (userLocation) => {
  if (!userLocation)
    return;
  const stationArr = stations;
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
    return ({
      latitude: stationArr[idx]["fields"]["geo_point_2d"][0],
      longitude: stationArr[idx]["fields"]["geo_point_2d"][1],
      name: stationArr[idx]["fields"]["libelle"],
      distance: closest
    });
  }
  return undefined;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: data },
    },
    trigger: { seconds: 2 },
  });
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("error", error);
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations && locations.length) {
      const location = locations.length ? locations[0].coords : null;
      const closestStation = await GetClosestStation(location);
      if (closestStation != undefined) {
        await schedulePushNotification("Gare la plus proche:",
        `${closestStation.name} à ${closestStation.distance.toFixed(0)} m`, closestStation);
      }
    }
  }
});
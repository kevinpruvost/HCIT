import { StatusBar } from 'expo-status-bar';
import { React, useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/views/home/HomeScreen';
import TicketsView from './src/views/tickets/TicketsView';
import ScanView from './src/views/scan/ScanView';
import { TicketPickerScreen } from './TicketPicker';
import { Notification } from './Notification';
import { navigationRef } from './RootNavigation';

import * as TaskManager from "expo-task-manager";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Location from "expo-location";

import GetClosestStation from './GetClosestStation';

const LOCATION_TASK_NAME = "background-location-task";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

export async function PushNotification(title, body) {
  await schedulePushNotification(title, body);
  alert("pit")
}

const Tab = createBottomTabNavigator();

const ICONS = {
  HomeScreen: "home",
  Settings: "settings",
  Profile: "person",
  TicketPurchase: "train",
  Test2: "flag",
  Tickets: "card",
  Scan: "qr-code"
};

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    // Notifications.addNotificationsDroppedListener();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      navigationRef.navigate('TicketPurchase')
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  // Start background notification task
  useEffect(() => {
    const subscribeBackgroundTaskLocation = async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status === "granted") {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!hasStarted)
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 10000,
          });
      }
    }
    subscribeBackgroundTaskLocation();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar hidden={false} />
      <Tab.Navigator
        backBehavior='none'
        screenOptions={({ route }) => ({
          tabBarIcon({ focused, color, size }) {
            const name = ICONS[route.name] + (focused ? "-outline" : "");

            return <Ionicons name={name} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'purple',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          options={{ headerShown: false, title: 'Home' }}
          name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen
          options={{ headerShown: true, title: "Purchase", headerTitle: "Ticket Purchase" }}
          name="TicketPurchase" component={TicketPickerScreen} />
        <Tab.Screen name="Tickets" component={TicketsView} />
        <Tab.Screen name="Scan" component={ScanView} />
        <Tab.Screen name="Test2" component={Notification} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice && Device.osName != "Windows") {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

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
      if (closestStation != undefined/* disabled for testing purposes && closestStation.distance < 500 */) {
        await schedulePushNotification("Gare la plus proche:",
          `${closestStation.name} à ${closestStation.distance.toFixed(0)} m`, closestStation);
      }
    }
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {

  }
});

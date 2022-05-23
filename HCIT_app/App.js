import { StatusBar } from 'expo-status-bar';
import {React, useState, useEffect, useRef} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TicketPickerScreen } from './TicketPicker';
import TicketsView from './src/views/tickets/TicketsView';
import ScanView from './src/views/scan/ScanView';
import { Notification } from './Notification';
import { scheduleNotificationAsync } from 'expo-notifications';
import { navigationRef } from './RootNavigation';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

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

export async function PushNotification(title, body)
{
  await schedulePushNotification(title, body);
  alert("pit")
}

const Tab = createBottomTabNavigator();

const ICONS = {
    Home:     "home",
    Settings: "settings",
    Profile:  "person",
    Test:     "flag",
    Test2:     "flag",
    Tickets:  "card",
    Scan:     "qr-code"
};

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    Notifications.addNotificationsDroppedListener

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log("notification received !!!!!")
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        navigationRef.navigate('Test')
    });


    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar hidden={false} />
      <Tab.Navigator
        backBehavior='none'
        screenOptions={({route}) => ({
          tabBarIcon({focused, color, size}) {
            const name = ICONS[route.name] + (focused ? "-outline" : "");

            return <Ionicons name={name} size={size} color={color}/>;
          },
          tabBarActiveTintColor: 'purple',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Test" component={TicketPickerScreen} />
        <Tab.Screen name="Tickets" component={TicketsView} />
        <Tab.Screen name="Scan" component={ScanView} />
        <Tab.Screen name="Test2" component={Notification} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

async function schedulePushNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: 'goes here' },
    },
    trigger: null,
  });
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

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';

// import {PushNotification} from './App';

// export function Notification() {
//   const [data, setData] = useState('nothing');

//   async function Notify() {
//     PushNotification("Quicket", "Don't forget your ticket! ✈️")
//   }

//   return (
//     <View style={{ flex: 1, alignItems: 'center' }} scrollEnabled={true}>
//       <Button title='Notification' color='purple' onPress={async() => { await Notify() }}>Reload</Button>
//       <Text>{data}</Text>
//     </View>
//   );
// }
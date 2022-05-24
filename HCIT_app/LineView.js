import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import Utils from './src/Utils';
import destinations from "./resources/popular-destinations.json";


export function LineView(props) {
    const [lines, setLines] = useState(props.stop.lines)
    const [currentStation, setCurrentStation] = useState(props.currentStation)
    const [arrivalStation, setArrivalStation] = useState(props.stop.stopStation)

    const url = "https://www.sncf-connect.com/app/home/search"
    const autocompleteUrl = "https://www.sncf-connect.com/bff/api/v1/autocomplete"
    const autocompleteBffKey = "ah1MPO-izehIHD-QZZ9y88n-kku876"

    useEffect(()=>{
        if (props.stop.lines.length == 1)
        {
            buyTicket(props.stop.lines[0])
        }
    },[props, lines, currentStation, arrivalStation])

    async function GetCode(station)
    {
        try {
            const body = {
                searchTerm: station,
                keepStationsOnly: false
            }
            const response = await fetch(autocompleteUrl, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Content-Type': 'application/json',
                    'x-bff-key': autocompleteBffKey
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            console.log(json.places.transportPlaces[0].id)
            return json.places.transportPlaces[0].id
        } catch (e) {
            console.log("error get code")
            console.log(e)
            return undefined;
        } finally {
            console.log("get code finished")
        }
    }

    async function buyTicket(stop)
    {
        var params = 
        {
            originLabel:      currentStation,
            originId:         await GetCode(currentStation),
            destinationLabel: arrivalStation,
            destinationId:    await GetCode(arrivalStation)
        };
        var fullUrl = url + Utils.buildUrlParams(params);
        await Linking.openURL(fullUrl);
    }

    function getArrivalTimeFromCurrentStation(stops)
    {
        for (var stop of stops)
        {
            if (stop.arrivalStation == currentStation)
                return stop.arrivalTime;
        }
        return "ERROR";
    }

    return (
        <View style={{width: '100%', alignItems: 'center'}} scrollEnabled={true}>
            <FlatList
                style={{width: '90%'}}
                scrollEnabled={true}
                data={lines}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ScrollView>
                        <ScrollView>
                            <Pressable
                                style={[styles.button, styles.shadowProp]}
                                onPress={async() => { buyTicket(item); }}
                            >
                                <Text style={[styles.text1]}>{currentStation} - {arrivalStation}</Text>
                                <Text style={[styles.text2]}>{getArrivalTimeFromCurrentStation(item.line.stops)} - {item.stopArrivalTime}</Text>
                            </Pressable>
                        </ScrollView>
                    </ScrollView>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginBottom: 10,
      borderRadius: 30,
      backgroundColor: '#25aae1',
    },
    text1: {
        width: '49%',
        textAlign: 'left',
        fontSize: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
      text2: {
          width: '49%',
          alignSelf: 'flex-end',
          textAlign: 'right',
          fontSize: 12,
          lineHeight: 21,
          fontWeight: 'bold',
          letterSpacing: 0.25,
          color: 'white',
        },
    shadowProp: {
        elevation: 10,
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
});
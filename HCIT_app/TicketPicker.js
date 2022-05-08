import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';

const forbiddenUris = [
    "physical_mode:Tramway",
    "physical_mode:Bike",
    "physical_mode:Bus",
]

const token = 'e3a2789c-97c9-4fa7-b4fa-5b21806cba26'

function objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
        if (Array.isArray(obj[key]))
            for (const part in obj[key])
                keyValuePairs.push(encodeURIComponent(key) + '[]=' + obj[key][part]);
        else
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
  }

export function TicketPickerScreen() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [lines, setLines] = useState([]);
    const [test, setTest] = useState([]);

    function StopPoint(arrivalStation, arrivalTime) {
        this.arrivalStation = arrivalStation
        this.arrivalTime = arrivalTime
    }

    function Line(arrivalStation, departureTime, stops) {
        this.arrivalStation = arrivalStation;
        this.departureTime = departureTime;
        this.stops = stops;
    }

    function parseTime(time) {
        var parsedTime = time;
        if (time.length > 6)
            parsedTime = time.slice(-6)
        return parsedTime[0] + parsedTime[1] + ":" + parsedTime[2] + parsedTime[3] + ":" + parsedTime[4] + parsedTime[5];
    }

    const getLineFromJourneyId = async(arrivalStation, departureTime, vehicleJourneyId) => {
        try {
            const url = `https://api.navitia.io/v1/coverage/6.173974005707584;48.68975721995908/vehicle_journeys/${vehicleJourneyId}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const json = await response.json();
            if ("vehicle_journeys" in json)
            {
                var stops = []
                for (var stopId in json.vehicle_journeys[0]["stop_times"])
                {
                    var stop = json.vehicle_journeys[0]["stop_times"][stopId]
                    var stopPoint = new StopPoint(stop["stop_point"]["name"], parseTime(stop["arrival_time"]))
                    stops.push(stopPoint)
                }
                var line = new Line(arrivalStation, departureTime, stops)
                setLines(prevArray => [...prevArray, line])
            }
        } catch {

        } finally {

        }
    }

    const formLines = async(json) => {
        setLines([])
        for (var lineI in json.departures)
        {
            var departure = json.departures[lineI]
            for (var linkI in departure.links)
            {
                var link = departure.links[linkI]
                if (link.type == "vehicle_journey")
                {
                    await getLineFromJourneyId(departure.route.direction.stop_area.name, parseTime(departure.stop_date_time.departure_date_time), link.id)
                }
            }
        }
    }

    const getDeparturesFromCoordinate = async(coords1, coords2) => { // Lat;Lon (5.1246;1.23548)
        const queryString = objToQueryString({
            duration: 3600,
            forbidden_uris: forbiddenUris,
            count: 50
        });
        try {
            setLoading(true);
            const url = `https://api.navitia.io/v1/coverage/${coords1}/coords/${coords2}/departures?${queryString}`
            setTest(url)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const json = await response.json();
            if ("departures" in json)
            {
                await formLines(json);
                setTest(lines)
                setData(json.departures);
            }
            else
                setData(json);
        } catch {
            setData("error")
            console.error("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDeparturesFromCoordinate("6.173974005707584;48.68975721995908", "6.173974005707584;48.68975721995908");
    }, []);
    return (
      <View style={{ flex: 1, alignItems: 'center' }} scrollEnabled={true}>
        <Button title='Reload' color='purple' onPress={async() => { getDeparturesFromCoordinate("6.173974005707584;48.68975721995908", "6.173974005707584;48.68975721995908") }}>Reload</Button>
        {
        isLoading ?
        <Text>Loading...</Text>
        :
        <View scrollEnabled={true}>
            {/* <Text scrollEnabled={true}>{JSON.stringify(test[0])}</Text> */}
            <FlatList
                scrollEnabled={true}
                data={lines}
                keyExtractor={item => item.arrivalTime}
                renderItem={({ item }) => (
                    <ScrollView>
                        <ScrollView horizontal={true}>
                            <Text>{item.arrivalStation} </Text>
                            <Text>Departure Time: {item.departureTime}</Text>
                        </ScrollView>

                        <ScrollView horizontal={true}>
                            <Text>Line: </Text>
                            <FlatList
                            horizontal={true}
                            contentContainerStyle={{paddingBottom: 15}}
                            scrollEnabled={true}
                            keyExtractor={item => item.arrivalStation}
                            data={item.stops}
                            renderItem={({ item }) => (
                                <ScrollView style={{minWidth: 100}}>
                                    <Text>{item.arrivalStation}: </Text>
                                    <Text>{item.arrivalTime}</Text>
                                </ScrollView>
                            )}
                            />
                        </ScrollView>
                    </ScrollView>
                )}
            />
        </View>
        }
      </View>
    );
  }
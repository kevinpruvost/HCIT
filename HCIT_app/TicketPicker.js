import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import { LineView } from './LineView';
import { TicketView } from './TicketView';

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
    const [linesReady, setLinesReady] = useState(false);
    const [linesPerStop, setLinesPerStop] = useState({});
    const [linesPerStopArray, setLinesPerStopArray] = useState({});

    const lines2 = []

    useEffect(() => {
        if (linesReady)
        {
            formStopsList()
            setLinesReady(false)
        }
    }, [lines, linesReady, linesPerStop, linesPerStopArray])
    var lines_temp = []

    var StopId = 0;
    function StopPoint(arrivalStation, arrivalTime) {
        this.id = StopId++;
        this.arrivalStation = arrivalStation
        this.arrivalTime = arrivalTime
    }

    var LineIds = 0;
    function Line(arrivalStation, departureTime, stops) {
        this.id = LineIds++;
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

    var coords = ""
    const getLineFromJourneyId = async(arrivalStation, departureTime, vehicleJourneyId) => {
        try {
            const url = `https://api.navitia.io/v1/coverage/${coords}/vehicle_journeys/${vehicleJourneyId}`
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
                await setLines(prevArray => [...prevArray, line])
            }
        } catch {
            console.log("Retry " + arrivalStation)
            await getLineFromJourneyId(arrivalStation, departureTime, vehicleJourneyId)
        } finally {
        }
    }

    const formStopsList = async() => {
        await setLinesPerStop({})
        var linesPerStop_temp = {}
        var linesPerStopArray_temp = []
        for (let line of lines)
        {
            for (let stop of line.stops)
            {
                const name = stop["arrivalStation"]
                if (name in linesPerStop_temp)
                {
                    linesPerStop_temp[name].lines = [...linesPerStop_temp[name].lines, {line: line, stopArrivalTime: stop["arrivalTime"]}]
                }
                else
                {
                    linesPerStop_temp[name] = {
                        stopStation: name,
                        lines: [{line: line, stopArrivalTime: stop["arrivalTime"]}]
                    }
                }
            }
        }
        for (var key in linesPerStop_temp)
        {
            linesPerStopArray_temp = [...linesPerStopArray_temp, linesPerStop_temp[key]]
        }
        await setLinesPerStop(linesPerStop_temp)
        await setLinesPerStopArray(linesPerStopArray_temp)
        console.log("finished STOPS")
    }

    const formLines = async(json) => {
        //setLines([])
        lines_temp = []
        for (var lineI in json.departures)
        {
            var departure = json.departures[lineI]
            for (var linkI in departure.links)
            {
                var link = departure.links[linkI]
                if (link.type == "vehicle_journey")
                {
                    console.log("Retrieving line from: " + departure.route.direction.stop_area.name + ": " + parseTime(departure.stop_date_time.departure_date_time))
                    await getLineFromJourneyId(departure.route.direction.stop_area.name, parseTime(departure.stop_date_time.departure_date_time), link.id)
                }
            }
        }
        await setLinesReady(true)
    }

    const getDeparturesFromCoordinate = async(coords1) => { // Lat;Lon (5.1246;1.23548)
        coords = coords1;
        const queryString = objToQueryString({
            duration: 1800,
            forbidden_uris: forbiddenUris,
            count: 50
        });
        try {
            setLoading(true);
            const url = `https://api.navitia.io/v1/coverage/${coords1}/coords/${coords1}/departures?${queryString}`
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
            }
            else
                setData(json);
        } catch {
            setData("error")
            console.error("frites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDeparturesFromCoordinate("6.173974005707584;48.68975721995908");
    }, []);
    return (
      <View style={{ flex: 1, alignItems: 'center' }} scrollEnabled={true}>
        <View style={{ position: 'absolute', right: '2%', top: '-8.5%' }} >
            <Button title='Reload' color='purple' onPress={async() => { getDeparturesFromCoordinate("6.173974005707584;48.68975721995908") }}>Reload</Button>
        </View>
        {
        isLoading ?
        <Text style={{alignContent:'center', justifyContent:'center', display: 'flex'}}>Loading...</Text>
        :
        <View style={{width: '100%', alignItems: 'center'}} scrollEnabled={true}>
            {/* <Text scrollEnabled={true}>{JSON.stringify(test[0])}</Text> */}
            <View style={{width: '95%', alignItems: 'center', flexDirection: "row"}}>
                <Text style={styles.currentStationText}>Current Station: Lunéville</Text>
                <Text style={styles.departureText}>Departures:</Text>
            </View>
            <TicketView linesPerStop={linesPerStop} linesPerStopArray={linesPerStopArray} ></TicketView>
        </View>
        }
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
    currentStationText: {
        width: '65%',
        textAlign: 'left',
        alignSelf: 'auto',
        fontSize: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'gray',
        padding: 10
    },
    departureText: {
        width: '30%',
        textAlign: 'right',
        alignSelf: 'auto',
        fontSize: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'gray',
        padding: 10
    },
    text1: {
      textAlign: 'left',
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    text2: {
        alignSelf: 'flex-end',
        textAlign: 'right',
        fontSize: 14,
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
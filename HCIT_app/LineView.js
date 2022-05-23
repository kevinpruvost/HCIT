import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';

export function LineView(props) {
    const [lines, setLines] = useState([])
    const [arrivalStation, setArrivalStation] = useState("")

    useEffect(()=>{
        setLines(props.stop.lines)
        setArrivalStation(props.stop.stopStation)
        console.log(props.stop)
    }, [props])
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
                                onPress={async() => { stop = item }}
                            >
                                <Text style={[styles.text1]}>{item.line.stops[0].arrivalStation} - {arrivalStation}</Text>
                                <Text style={[styles.text2]}>{item.line.stops[0].arrivalTime} - {item.stopArrivalTime}</Text>
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
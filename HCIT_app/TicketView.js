import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import { LineView } from './LineView';

export function TicketView(props) {
    const [lps, setLinesPerStop] = useState({})
    const [lpsa, setLinesPerStopArray] = useState([])
    const [stop, setStop] = useState(null)

    useEffect(()=>{
        setLinesPerStop(props.linesPerStop)
        setLinesPerStopArray(props.linesPerStopArray)
    }, [props])

    BackHandler.addEventListener("hardwareBackPress", function(){
        setStop(null);
    })
    
    return (
        <View style={{width: '100%', alignItems: 'center'}} scrollEnabled={true}>
        {
        stop === null ?
        <FlatList
                style={{width: '90%'}}
                scrollEnabled={true}
                data={lpsa}
                keyExtractor={item => item.stopStation}
                renderItem={({ item }) => (
                    <ScrollView>
                        <ScrollView>
                            <Pressable
                                style={[styles.button, styles.shadowProp]}
                                onPressIn={async() => { setStop(item); }}
                            >
                                <Text style={[styles.text1]}>{item.stopStation}</Text>
                                <Text style={[styles.text2]}>{item.lines[0].line.departureTime}</Text>
                            </Pressable>
                        </ScrollView>
                    </ScrollView>
                )}
            />
        :
        <LineView stop={stop}></LineView>
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
    text1: {
      width: '48%',
      textAlign: 'left',
      fontSize: 12,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    text2: {
        width: '48%',
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
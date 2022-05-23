import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, BackHandler } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { FlatList, Button, ActivityIndicator, ListItem } from 'react-native';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import { LineView } from './LineView';

export function TicketView(props) {
    const [lps, setLinesPerStop] = useState({})
    const [lpsa, setLinesPerStopArray] = useState([])
    const [stop, setStop] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [currentStation, setCurrentStation] = useState("")

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useEffect(()=>{
        setLinesPerStop(props.linesPerStop)
        setLinesPerStopArray(props.linesPerStopArray)
        setCurrentStation(props.currentStation)
    }, [props])

    BackHandler.addEventListener("hardwareBackPress", function(){
        setStop(null);
    })
    
    return (
        <View style={{width: '100%', alignItems: 'center'}} scrollEnabled={true}>
        {
        stop === null ?
        <FlatList
                onRefresh={() => { if (props.refreshCallback) props.refreshCallback()}}
                refreshing={fetching}
                style={{width:'90%'}}
                contentContainerStyle={{justifyContent: 'space-around'}}
                scrollEnabled={true}
                data={lpsa}
                keyExtractor={item => item.stopStation}
                renderItem={({ item }) => (
                    <ScrollView>
                        <ScrollView>
                            <Pressable
                                style={[styles.button, styles.shadowProp]}
                                onPress={async() => { setStop(item); }}
                            >
                                <Text style={[styles.text1]}>{item.stopStation}</Text>
                                <Text style={[styles.text2]}>{item.lines[0].line.departureTime}</Text>
                            </Pressable>
                        </ScrollView>
                    </ScrollView>
                )}
            />
        :
        <LineView stop={stop} currentStation={currentStation}></LineView>
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
      width: '70%',
      textAlign: 'left',
      fontSize: 12,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    text2: {
        width: '30%',
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
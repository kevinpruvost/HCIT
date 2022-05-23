import React, {Component} from "react";

import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomeView from "./HomeView";
import PopularSightView from "./PopularSightView";
import PurchaseWebView from "./PurchaseWebView";

const Stack = createNativeStackNavigator();

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{
                animation: "slide_from_right"
            }}>
                <Stack.Screen
                    name="Home"
                    component={HomeView}/>
                <Stack.Screen
                    name="PopularSight"
                    component={PopularSightView}
                    options={{
                        title: "Popular sight",
                        headerStyle: {backgroundColor: "#338A3E"},
                        headerTintColor: "#fff"
                }}/>
                <Stack.Screen
                    name="PurchaseWebView"
                    component={PurchaseWebView}
                    options={{
                        title: "Ticket purchase",
                        headerStyle: {backgroundColor: "#338A3E"},
                        headerTintColor: "#fff"
                }}/>
            </Stack.Navigator>
        );
    }
}

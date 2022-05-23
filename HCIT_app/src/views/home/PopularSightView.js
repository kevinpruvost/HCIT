import {View, Text, ScrollView} from "react-native";
import React, {Component} from "react";

import {Picker} from "@react-native-picker/picker";

import Destination from "./Destination";

import SettingsStorage from "../../storage/SettingsStorage";

import destinations from "../../../resources/popular-destinations.json";

const styles = {
    main: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        paddingTop: 20,
    },
    header: {
        flexDirection: "column",
        width: "100%",
        paddingHorizontal: 20
    },
    headerText: {
        opacity: .4,
        paddingHorizontal: 10
    },
    scrollView: {
        paddingHorizontal: 20
    }
};

export default class HomeView extends Component {
    constructor(props) {
        super(props);


        this.state = {
            origin: "Paris"
        };
        SettingsStorage.get("sightOrigin").then(origin => {
            this.setState({origin});
        });
    }

    setOrigin(origin) {
        this.setState({origin});
        void SettingsStorage.set({sightOrigin: origin});
    }

    openPage(label, code) {
        this.props.navigation.push(
            "PurchaseWebView",
            {
                originLabel:      this.state.origin,
                originId:         destinations[this.state.origin],
                destinationLabel: label,
                destinationId:    code
            }
        );
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Current station:</Text>
                    <Picker
                        selectedValue={this.state.origin}
                        onValueChange={value => this.setOrigin(value)}>
                        {Object.entries(destinations).map(([name, code], i) => (
                            <Picker.Item key={i} label={name} value={name} />
                        ))}
                    </Picker>
                </View>
                <ScrollView style={styles.scrollView}>
                    {Object.entries(destinations).map(([name, code], i) => (
                        name == this.state.origin
                            ? null
                            : <Destination
                                key={i}
                                label={name}
                                onPress={() => this.openPage(name, code)}/>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

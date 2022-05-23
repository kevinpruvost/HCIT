import {View, Text, Switch} from "react-native";
import React, {Component} from "react";

import StyledButton from "../../components/StyledButton";

import SettingsStorage from "../../storage/SettingsStorage";

const colors = {
    traveler: {header: "#338A3E", button: "#66BB6A"},
    local: {header: "#0277BD", button: "#3FB7FD"}
};

const styles = {
    main: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        paddingVertical: 10
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    header: {
        paddingHorizontal: 20
    },
    firstRow: {
        marginTop: "auto"
    },
    lastRow: {
        marginBottom: "auto"
    },
    switchTitle: {
        fontSize: 12,
        marginRight: 10,
        opacity: .4,
        marginLeft: "auto"
    },
    button: {
        flex: 1,
        minHeight: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 10
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        textAlign: "center"
    }
};

export default class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTravelerMode: false
        };

        SettingsStorage.load().then(({isTravelerMode}) => {
            this.setState({isTravelerMode}, () => {
                this.props.navigation.setOptions({
                    headerStyle: {
                        backgroundColor: this.colors.header
                    },
                    headerTintColor: "#fff"
                });
            });
        });
    }

    get colors() {
        return colors[this.state.isTravelerMode ? "traveler" : "local"];
    }

    async switchMode() {
        const new_mode = !this.state.isTravelerMode;

        await SettingsStorage.set({isTravelerMode: new_mode});

        this.setState({isTravelerMode: new_mode}, () => {
            this.props.navigation.setOptions({
                headerStyle: {
                    backgroundColor: this.colors.header
                }
            });
        });
    }

    openSection(name) {
        this.props.navigation.push(name);
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.switchTitle}>
                        {this.state.isTravelerMode ? "Traveler" : "Local"} mode
                    </Text>
                    <Switch
                        trackColor={{
                            false: colors.local.header,
                            true: colors.traveler.header
                        }}
                        thumbColor={this.colors.button}
                        onValueChange={() => this.switchMode()}
                        value={this.state.isTravelerMode}
                    />
                </View>
                <View style={[styles.row, styles.firstRow]}>
                    {
                        this.state.isTravelerMode ? (
                            <StyledButton
                                style={{
                                    ...styles.button,
                                    backgroundColor: this.colors.button
                                }}
                                textStyle={styles.buttonText}
                                ripple="rgba(255, 255, 255, .25)"
                                icon="eye"
                                text="Popular sight"
                                onPress={
                                    () => this.openSection("PopularSight")
                                }/>
                        ) : [
                            <StyledButton
                                key="0"
                                style={{
                                    ...styles.button,
                                    backgroundColor: this.colors.button
                                }}
                                textStyle={styles.buttonText}
                                ripple="rgba(255, 255, 255, .25)"
                                icon="time"
                                text="Recent trips"
                                onPress={() => {}}/>,
                            <StyledButton
                                key="1"
                                style={{
                                    ...styles.button,
                                    backgroundColor: this.colors.button
                                }}
                                textStyle={styles.buttonText}
                                ripple="rgba(255, 255, 255, .25)"
                                icon="calendar"
                                text="Weekend"
                                onPress={() => {}}/>
                        ]
                    }
                </View>
                <View style={styles.row}>
                    <StyledButton
                        style={{
                            ...styles.button,
                            backgroundColor: this.colors.button
                        }}
                        textStyle={styles.buttonText}
                        ripple="rgba(255, 255, 255, .25)"
                        icon="train"
                        text="Current train"
                        onPress={() => {}}/>
                    <StyledButton
                        style={{
                            ...styles.button,
                            backgroundColor: this.colors.button
                        }}
                        textStyle={styles.buttonText}
                        ripple="rgba(255, 255, 255, .25)"
                        icon="subway"
                        text="Current metro"
                        onPress={() => {}}/>
                </View>
                <View style={[styles.row, styles.lastRow]}>
                    <StyledButton
                        style={{
                            ...styles.button,
                            backgroundColor: this.colors.button
                        }}
                        textStyle={styles.buttonText}
                        ripple="rgba(255, 255, 255, .25)"
                        icon="pencil"
                        text="Subscriptions"
                        onPress={() => {}}/>
                </View>
            </View>
        );
    }
}

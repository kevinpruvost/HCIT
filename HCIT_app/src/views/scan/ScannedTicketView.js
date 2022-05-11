import TicketStorage from "../../storage/TicketStorage";

import {View, Text, ToastAndroid} from "react-native";
import React, {Component} from "react";

import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";

const styles = {
    main: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 10,
        backgroundColor: "#eee"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        width: "90%"
    },
    input: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
        marginVertical: 5,
        width: "90%"
    },
    focusedInput: {
        borderBottomColor: "#aaf"
    },
    button: {
        width: "90%",
        padding: 10,
        backgroundColor: "#0a0",
        marginTop: "auto",
        borderRadius: 5,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: "white",
        textAlign: "center"
    }
};

export default class ScannedTicketView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label: ""
        };
    }

    submit() {
        TicketStorage.add({
            label: this.state.label,
            date:  Date.now(),
            data:  this.props.result
        }).then(() => {
            ToastAndroid.show("Ticket saved", ToastAndroid.SHORT);
            this.props.onSave?.();
            this.setState({label: ""});
        });
    }

    render() {
        return (
            <View style={styles.main}>
                <Text style={styles.title}>New ticket</Text>
                <StyledTextInput
                    value={this.state.label}
                    style={styles.input}
                    focusedStyle={styles.focusedInput}
                    placeholder="Label"
                    onChangeText={val => this.setState({label: val})}/>
                <StyledButton
                    style={styles.button}
                    textStyle={styles.buttonText}
                    ripple="rgba(255, 255, 255, .25)"
                    text="Save"
                    onPress={this.submit.bind(this)}/>
            </View>
        );
    }
}

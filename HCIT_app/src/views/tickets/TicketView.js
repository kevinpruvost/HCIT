import {View, Text, Dimensions} from "react-native";
import React, {Component} from "react";
import QRCode from "react-native-qrcode-svg";

import StyledButton from "../../components/StyledButton";

const styles = {
    main: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: "#eee"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        width: "90%"
    },
    qrcode: {
        marginTop: "auto",
        marginBottom: "auto"
    },
    button: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
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

        const dimensions = Dimensions.get("window");
        const margin = 100;

        this.state = {
            size: Math.min(
                dimensions.width - margin,
                dimensions.height - margin
            ),
            label: "",
            data: props.data
        };
    }

    render() {
        return (
            <View style={styles.main}>
                <Text style={styles.title}>{this.props.label}</Text>
                <View style={styles.qrcode}>
                    <QRCode
                        size={this.state.size}
                        backgroundColor="#eee"
                        value={this.props.data ?? "Ticket"}/>
                </View>
                <StyledButton
                    style={{...styles.button, backgroundColor: "#a22"}}
                    textStyle={styles.buttonText}
                    ripple="rgba(255, 255, 255, .25)"
                    icon="trash"
                    text="Delete"
                    onPress={() => this.props.onDelete?.()}/>
                <StyledButton
                    style={{...styles.button, backgroundColor: "#aaa"}}
                    textStyle={styles.buttonText}
                    ripple="rgba(255, 255, 255, .25)"
                    icon="chevron-back"
                    text="Back"
                    onPress={() => this.props.onClose?.()}/>
            </View>
        );
    }
}

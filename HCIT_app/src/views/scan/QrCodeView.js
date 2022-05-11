import {View, Text, Vibration} from "react-native";
import {Component} from "react";

import {BarCodeScanner} from "expo-barcode-scanner";

const styles = {
    main: {
        flex: 1,
        width: "100%",
        backgroundColor: "#333",
    },
    text: {
        color: "white",
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, .4)",
        padding: 10
    },
    qrContainer: {
        display: "flex",
        alignItems: "center",
        flex: 1,
        paddingTop: 0
    },
    qrVideoContainer: {
        paddingTop: 0,
        display: "flex",
        alignItems: "center"
    },
    qrVideo: {
        position: "relative"
    }
};

export default class QrCodeView extends Component {
    constructor(props) {
        super(props);
    }

    setResult(result) {
        if (!result || this.props.result)
            return;

        Vibration.vibrate([50, 120]);
        this.props.onResult?.(result);
    };

    render() {
        return (
            <View style={styles.main}>
                {
                    this.props.isActive && (
                        <BarCodeScanner
                            onBarCodeScanned={
                                result => this.setResult(result?.data)
                            }
                            barCodeScannerSettings={{barCodeTypes: ["qr"]}}
                            style={styles.qrContainer}
                        />
                    )
                }
                <Text style={styles.text}>
                    {
                        this.props.result
                            ? "Scanned!"
                            : "Scan your ticket's QR code"
                    }
                </Text>
            </View>
        );
    }
}

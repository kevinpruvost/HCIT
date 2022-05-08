import {Animated, Easing} from "react-native";
import {Component} from "react";

import QrCodeView from "./QrCodeView";
import ScannedTicketView from "./ScannedTicketView";

const styles = {
    main: {
        flex: 1,
        flexDirection: "row",
        width: "200%",
        overflow: "scroll"
    }
};

export default class ScanView extends Component {
    constructor(props) {
        super(props);

        this.navigation = props.navigation;
        this.state = {
            isActive: true,
            result: null,
            isFocused: false,
            animatedMargin: new Animated.Value(0)
        };
    }

    processQrResult(result) {
        this.setState({result});

        Animated.timing(this.state.animatedMargin, {
            toValue: 1,
            duration: 6e2,
            useNativeDriver: false
        }).start(() => {
            this.setState({isActive: false});
        });
    };

    processSavedTicket() {
        this.navigation.jumpTo("Tickets");

        this.state.animatedMargin.setValue(0);
        this.setState({isActive: true, result: null});
    }

    render() {
        return (
            <Animated.View
                style={{
                    ...styles.main,
                    marginLeft: this.state.animatedMargin.interpolate({
                        inputRange:  [0, 1],
                        outputRange: ["0%", "-100%"],
                        easing:      Easing.ease
                    })
                }}
                scrollEnabled={true}
            >
                <QrCodeView
                    isActive={this.state.isActive}
                    result={this.state.result}
                    onResult={result =>this.processQrResult(result)}/>
                <ScannedTicketView
                    result={this.state.result}
                    onSave={this.processSavedTicket.bind(this)}/>
            </Animated.View>
        );
    }
}

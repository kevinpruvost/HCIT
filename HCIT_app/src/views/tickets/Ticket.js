import {Text, Pressable} from "react-native";
import {Component} from "react";

const styles = {
    main: {
        flexDirection: "row",
        backgroundColor: "#ddf",
        alignItems: "center",
        borderRadius: 10,
        width: "95%",
        marginVertical: 5,
        padding: 10
    },
    label: {
        color: "#66f",
        fontSize: 16
    },
    date: {
        color: "#66f",
        fontSize: 12,
        marginLeft: "auto",
        opacity: 1 / 3
    }
};

export default class TicketQrCodeView extends Component {
    constructor(props) {
        super(props);
    }

    onPress() {
        this.props.onPress?.({
            label: this.props.label,
            date:  this.props.date,
            data:  this.props.data
        });
    }

    render() {
        return (
            <Pressable
                style={styles.main}
                android_ripple={{color: "rgba(0, 0, 0, .1)"}}
                onPress={() => this.onPress()}>
                <Text style={styles.label}>
                    {this.props.label}
                </Text>
                <Text style={styles.date}>
                    {new Date(this.props.date).toLocaleString()}
                </Text>
            </Pressable>
        );
    }
}

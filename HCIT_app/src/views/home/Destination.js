import {Text, Pressable} from "react-native";
import {Component} from "react";

const styles = {
    main: {
        flexDirection: "row",
        backgroundColor: "#ada",
        alignItems: "center",
        borderRadius: 20,
        width: "100%",
        marginVertical: 5,
        padding: 10
    },
    label: {
        color: "#696",
        fontSize: 16
    }
};

export default class Destination extends Component {
    constructor(props) {
        super(props);
    }

    onPress() {
        this.props.onPress?.(this.props.label);
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
            </Pressable>
        );
    }
}

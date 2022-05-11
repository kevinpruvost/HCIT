import {Pressable, Text} from "react-native";
import React, {Component} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default class StyledButton extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        return (
            <Pressable
                style={this.props.style}
                android_ripple={
                    this.props.ripple ? {color: this.props.ripple} : null
                }
                onPress={() => this.props.onPress?.()}>
                {
                    this.props.icon && <Ionicons
                        name={this.props.icon}
                        size={20}
                        color="white"/>
                }
                <Text style={this.props.textStyle}>
                    {(this.props.icon ? " " : "") + this.props.text}
                </Text>
            </Pressable>
        );
    }
}

import {TextInput} from "react-native";
import {Component} from "react";

export default class StyledTextInput extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            style: this.props.style || {}
        };
    }

    onFocus() {
        if (!this.props.style || !this.props.focusedStyle)
            return;

        this.setState({
            style: {...this.props.style, ...this.props.focusedStyle}
        })
        this.props.onFocus?.();
    }

    onBlur() {
        if (!this.props.style || !this.props.focusedStyle)
            return;

        this.setState({
            style: this.props.style
        })
        this.props.onBlur?.();
    }

    render() {
        return (
            <TextInput
                {...this.props}
                style={this.state.style}
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}/>
        );
    }
}

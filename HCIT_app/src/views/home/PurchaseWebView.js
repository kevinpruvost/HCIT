import React, { Component } from "react";
import { WebView } from "react-native-webview";

import Utils from "../../Utils";

export default class PurchaseWebView extends Component {
    static BASE_URL = "https://www.sncf-connect.com/app/home/search";

    constructor(props) {
        super(props);

        this.state = {
            url: PurchaseWebView.BASE_URL + Utils.buildUrlParams(
                this.props.route.params
            )
        };
    }

    render() {
        return (
            <WebView source={{uri: this.state.url}}/>
        );
    }
}

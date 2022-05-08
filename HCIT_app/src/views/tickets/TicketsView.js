import TicketStorage from "../../storage/TicketStorage";

import {View, ScrollView, Text, Animated, Easing} from "react-native";
import {Component} from "react";

import Ticket from "./Ticket";
import TicketView from "./TicketView";

const styles = {
    main: {
        flex: 1,
        flexDirection: "row",
        width: "200%"
    },
    item: {
        flex: 1,
        width: "100%",
    },
    emptyView: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15
    },
    emptyText: {
        fontSize: 16,
        opacity: .25
    },
    list: {
        flexDirection: "column",
        marginTop: 5
    }
};

export default class TicketQrCodeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickets: [],
            animatedMargin: new Animated.Value(0),
            selectedTicket: {}
        };
    }

    openTicket(data, idx) {
        this.state.selectedTicket = {...data, idx};

        Animated.timing(this.state.animatedMargin, {
            toValue: 1,
            duration: 4e2,
            useNativeDriver: false
        }).start();
    }

    closeTicket() {
        Animated.timing(this.state.animatedMargin, {
            toValue: 0,
            duration: 4e2,
            useNativeDriver: false
        }).start();
    }

    deleteTicket() {
        this.state.tickets.splice(this.state.selectedTicket.idx, 1);
        this.closeTicket();

        void TicketStorage.save(this.state.tickets);
    }

    render() {
        TicketStorage.list().then(tickets => this.setState({tickets}));

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
                <ScrollView
                    style={[styles.item, styles.list]}
                    contentContainerStyle={{flexGrow: 1, alignItems: "center"}}>
                    {
                        this.state.tickets.map(
                            (props, i) => (
                                <Ticket
                                    {...props}
                                    key={i}
                                    onPress={data => this.openTicket(data, i)}/>
                            )
                        )
                    }
                    {
                        !this.state.tickets.length && (
                            <View style={styles.emptyView}>
                                <Text style={styles.emptyText}>
                                    Your tickets will show up here
                                </Text>
                            </View>
                        )
                    }
                </ScrollView>
                <TicketView
                    {...this.state.selectedTicket}
                    style={[styles.item]}
                    onDelete={() => this.deleteTicket()}
                    onClose={this.closeTicket.bind(this)}/>
            </Animated.View>
        );
    }
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class TicketStorage {
    static async list() {
        return JSON.parse(
            (await AsyncStorage.getItem("tickets")) || "[]"
        );
    }

    static save(tickets) {
        return AsyncStorage.setItem(
            "tickets",
            JSON.stringify(tickets)
        );
    }

    static async add(ticket) {
        const tickets = await TicketStorage.list();

        return AsyncStorage.setItem(
            "tickets",
            JSON.stringify([ticket, ...tickets])
        );
    }
}

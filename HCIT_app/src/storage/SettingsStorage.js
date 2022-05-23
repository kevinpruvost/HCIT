import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SettingsStorage {
    static async load() {
        return JSON.parse(
            (await AsyncStorage.getItem("settings")) || "{}"
        );
    }

    static async get(key) {
        return JSON.parse(
            (await AsyncStorage.getItem("settings")) || "{}"
        )[key];
    }

    static async set(obj) {
        const settings = await SettingsStorage.load();

        return AsyncStorage.setItem(
            "settings",
            JSON.stringify({...settings, ...obj})
        );
    }
}

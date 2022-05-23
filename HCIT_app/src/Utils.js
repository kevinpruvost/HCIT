export default class Utils {
    static buildUrlParams(obj) {
        return "?" + Object.entries(obj).map(pair =>
            pair.map(encodeURIComponent).join("=")
        ).join("&")
    }
}

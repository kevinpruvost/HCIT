const axios = require("axios");

const config = require("../config.json");
const colors = require("../colors.json");

const colorize = (text, color) => colors.fg[color] + text + colors.reset;

class Main {
    static async get_paths(from_id, to_id, date) {
        const {data} = await axios({
            url: config.endpoints.itineraries,
            method: "post",
            headers: {
                Accept: "*/*",
                "content-type": "application/json",
                "user-agent": config.user_agent,
                "x-bff-key": config.bff_key
            },
            data: {
                schedule: {
                    outward: {"date": date.toISOString()}
                },
                mainJourney: {
                    origin: {label: "_", id: from_id},
                    destination: {label: "_", id: to_id}
                },
                passengers: [
                    {id: "_", discountCards: [], typology: "ADULT"}
                ],
                pets: [],
                itineraryId: "_",
                forceDisplayResults: true,
                trainExpected: true
            }
        });

        return data?.longDistance?.proposals?.proposals;
    }

    static async search_place(query) {
        const {data} = await axios({
            url: config.endpoints.autocomplete,
            method: "post",
            headers: {
                "content-type": "application/json",
                "user-agent": config.user_agent,
                "x-bff-key": config.bff_key
            },
            data: {
                searchTerm: query,
                keepStationsOnly: false
            }
        });

        return data?.places?.transportPlaces;
    }

    static async display_places(query) {
        const places = await Main.search_place(query);
        const max_id_len = Math.max.apply(null, places.map(it => it.id.length));

        places.forEach(place => {
            console.log(
                "ID:",
                colorize(place.id.padEnd(max_id_len, " "), "green"),
                "Label:",
                colorize(place.label, "grey")
            );
        });
    }

    static async display_paths(from_id, to_id, date = "") {
        const given_date = new Date(date);

        date = isNaN(+given_date) ? new Date() : given_date;

        const paths = await Main.get_paths(from_id, to_id, date);


        console.log(paths.length, "paths total:");
        console.log();

        paths.forEach(({
            id, departure, arrival, durationLabel, bestPriceLabel,
            transporterDescription
        }) => {
            console.log("Path", colorize(id.split(", ")[0], "yellow") + ":");
            console.log(
                " ",
                "Departure:",
                colorize(departure?.originStationLabel, "blue"),
                "on",
                colorize(departure?.dateLabel, "cyan"),
                "at",
                colorize(departure?.timeLabel, "cyan")
            );
            console.log(
                " ",
                "Arrival:",
                colorize(arrival?.destinationStationLabel, "blue"),
                "on",
                colorize(arrival?.dateLabel, "cyan"),
                "at",
                colorize(arrival?.timeLabel, "cyan")
            );
            console.log(
                " ",
                "Trip duration:",
                colorize(durationLabel.replace("h", ":"), "yellow")
            );
            console.log(
                " ",
                "Description:",
                colorize(transporterDescription, "yellow")
            );
            console.log(
                bestPriceLabel
                    ? "  Price: " + colorize(bestPriceLabel, "yellow")
                    : colorize("  [Tickets not available]", "grey")
            );
            console.log();
        });
    }

    static async main(argv) {
        if (argv.length < 3)
            return console.error(
                "Please provide either a city name or two city ids " +
                "and an optional date"
            );
        if (argv.length == 3)
            return await Main.display_places(argv[2]);
        return await Main.display_paths(...argv.slice(2));
    }
}

void Main.main(process.argv);

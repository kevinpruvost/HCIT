import stations from './liste-des-gares.json';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

const GetClosestStation = async (userLocation) => {
  if (!userLocation)
    return;
  const stationArr = stations;
  let idx = -1;
  let closest = 9999999999;
  let i = 0;
  for (i = 0; i < stationArr.length; i++) {
    let val = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude,
      stationArr[i]["fields"]["geo_point_2d"][0], stationArr[i]["fields"]["geo_point_2d"][1])
    if (val < closest) {
      closest = val;
      idx = i;
    }
  }
  if (idx !== -1) {
    return ({
      latitude: stationArr[idx]["fields"]["geo_point_2d"][0],
      longitude: stationArr[idx]["fields"]["geo_point_2d"][1],
      name: stationArr[idx]["fields"]["libelle"],
      distance: closest
    });
  }
  return undefined;
}

export default GetClosestStation;
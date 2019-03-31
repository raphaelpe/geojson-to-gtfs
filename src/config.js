const constants = require('./constants');

module.exports = function createConfig(userConfig) {
  const config = {
    agencyId: (feature, featureIndex) => featureIndex + 1,
    agencyName: "UNNAMED",
    agencyTimezone: "America/La_Paz",
    agencyLang: "es",
    agencyUrl: "",
    routeId: (feature, featureIndex) => featureIndex + 1,
    routeShortName: "UNNAMED",
    routeLongName: "",
    routeType: constants.routeType.BUS,
    routeColor: "FF0000",
    stopId: (coords, coordsIndex, feature, featureIndex) => `${featureIndex}-${coordsIndex}`,
    stopName: "UNNAMED",
    stopLat: (coords) => coords[1],
    stopLon: (coords) => coords[0],
    tripId: (serviceWindow, feature, featureIndex) => `${serviceWindow.serviceId}-${featureIndex + 1}`,
    frequencyStartTime: "00:00:00",
    frequencyEndTime: "24:00:00",
    frequencyHeadwaySecs: 600, // every 10 minutes
    serviceWindows: [{
      serviceId: "mon-sun",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
      startDate: "20000101",
      endDate: "21000101",
    }],
    vehicleSpeed: 50,
    skipStopsWithinDistance: 0,
    stopDuration: 0,
    mapAgency,
    mapStop,
    mapRoute,
    mapTrip,
    mapStopTime,
    mapFrequency,
    mapService,
    mapVehicleSpeed,
    prepareInput: null,
    prepareGeojsonFeature: null,
    prepareOutput: null,
    ...userConfig,
  };

  return config;

  function getValueForKey(key, ...args) {
    const value = config[key];

    if (typeof value === "function") {
      return value(...args);
    }

    return value;
  }

  function mapAgency(feature, featureIndex) {
    return {
      agency_id: getValueForKey("agencyId", feature, featureIndex),
      agency_name: getValueForKey("agencyName", feature, featureIndex),
      agency_lang: getValueForKey("agencyLang", feature, featureIndex),
      agency_timezone: getValueForKey("agencyTimezone", feature, featureIndex),
      agency_url: getValueForKey("agencyUrl", feature, featureIndex),
    };
  }

  function mapStop(coords, coordsIndex, feature, featureIndex) {
    return {
      stop_id: getValueForKey("stopId", coords, coordsIndex, feature, featureIndex),
      stop_name: getValueForKey("stopName", coords, coordsIndex, feature, featureIndex),
      stop_lat: getValueForKey("stopLat", coords, coordsIndex, feature, featureIndex),
      stop_lon: getValueForKey("stopLon", coords, coordsIndex, feature, featureIndex),
    };
  }

  function mapRoute(feature, featureIndex) {
    return {
      route_id: getValueForKey("routeId", feature, featureIndex),
      agency_id: getValueForKey("agencyId", feature, featureIndex),
      route_short_name: getValueForKey("routeShortName", feature, featureIndex),
      route_long_name: getValueForKey("routeLongName", feature, featureIndex),
      route_type: getValueForKey("routeType", feature, featureIndex),
      route_color: getValueForKey("routeColor", feature, featureIndex),
    };
  }

  function mapTrip(serviceWindow, feature, featureIndex) {
    return {
      trip_id: getValueForKey("tripId", serviceWindow, feature, featureIndex),
      route_id: getValueForKey("routeId", feature, featureIndex),
      service_id: serviceWindow.serviceId,
    };
  }

  function mapStopTime(trip, stop, stopSequence, arrivalTime, departureTime) {
    return {
      trip_id: trip.trip_id,
      stop_sequence: stopSequence,
      stop_id: stop.stop_id,
      arrival_time: arrivalTime,
      departure_time: departureTime,
    };
  }

  function mapFrequency(trip, feature, featureIndex) {
    return {
      trip_id: trip.trip_id,
      start_time: getValueForKey("frequencyStartTime", trip, feature, featureIndex),
      end_time: getValueForKey("frequencyEndTime", trip, feature, featureIndex),
      headway_secs: getValueForKey("frequencyHeadwaySecs", trip, feature, featureIndex),
    };
  }

  function mapService(serviceWindow) {
    return {
      service_id: serviceWindow.serviceId,
      monday: serviceWindow.monday ? 1 : 0,
      tuesday: serviceWindow.tuesday ? 1 : 0,
      wednesday: serviceWindow.wednesday ? 1 : 0,
      thursday: serviceWindow.thursday ? 1 : 0,
      friday: serviceWindow.friday ? 1 : 0,
      saturday: serviceWindow.saturday ? 1 : 0,
      sunday: serviceWindow.sunday ? 1 : 0,
      start_date: serviceWindow.startDate,
      end_date: serviceWindow.endDate,
    };
  }

  function mapVehicleSpeed(feature, featureIndex) {
    return getValueForKey("vehicleSpeed", feature, featureIndex);
  }
};

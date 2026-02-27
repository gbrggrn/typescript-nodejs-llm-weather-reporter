import { type Weather } from "../types/weather.type.js"

// API specifics
const VADDO_STATION_ID = '98500'
const API_VERSION = '1.0'
const PERIOD = 'latest-hour'

// Parameters to fetch
const PARAM_DEWPOINT = 39
const PARAM_MIN_TEMP = 19
const PARAM_MAX_TEMP = 20
const PARAM_PRESSURE = 9
const PARAM_STATE_OF_GROUND_CODE = 40
const PARAM_CURRENT_WIND = 4
const PARAM_CURRENT_WIND_ORIENTATION_DEGREES = 3
const PARAM_RAINFALL_MONTH = 23
const PARAM_RAINFALL_TODAY = 5
const PARAM_RAINFALL_LATEST_HOUR = 7
const PARAM_RELATIVE_HUMIDITY_PERCENT = 6
const PARAM_SUNSHINE_LATEST_HOUR = 10

// Orchestrates fetching and returns a Weather-type with bundled values
export async function getWeather(): Promise<Weather> {
    console.log("[weather-api]Fetching data from SMHI...")
    const [dewpoint,
        minTemp,
        maxTemp,
        pressure,
        stateOfGroundCode,
        currentWind,
        windOrientationDegrees,
        rainfallMonth,
        rainfallToday,
        rainfallLastHour,
        relativeHumidityPercent,
        sunshineLatestHour
    ] = await Promise.all([
        getVaddoObservations(PARAM_DEWPOINT),
        getVaddoObservations(PARAM_MIN_TEMP),
        getVaddoObservations(PARAM_MAX_TEMP),
        getVaddoObservations(PARAM_PRESSURE),
        getVaddoObservations(PARAM_STATE_OF_GROUND_CODE),
        getVaddoObservations(PARAM_CURRENT_WIND),
        getVaddoObservations(PARAM_CURRENT_WIND_ORIENTATION_DEGREES),
        getVaddoObservations(PARAM_RAINFALL_MONTH),
        getVaddoObservations(PARAM_RAINFALL_TODAY),
        getVaddoObservations(PARAM_RAINFALL_LATEST_HOUR),
        getVaddoObservations(PARAM_RELATIVE_HUMIDITY_PERCENT),
        getVaddoObservations(PARAM_SUNSHINE_LATEST_HOUR)
    ])

    console.log("[weather-api]Constructing Weather object...")
    return {
        dewPoint: extractValue(dewpoint),
        dayTemp: {
            min: extractValue(minTemp),
            max: extractValue(maxTemp)
        },
        pressureHPa: extractValue(pressure),
        stateOfGroundCode: extractValue(stateOfGroundCode),
        wind: extractValue(currentWind),
        windOrientDegrees: extractValue(windOrientationDegrees),
        rainfallMonth: extractValue(rainfallMonth),
        rainfallDay: extractValue(rainfallToday),
        rainfallHour: extractValue(rainfallLastHour),
        relativeHumidity: extractValue(relativeHumidityPercent),
        sunshineLatestHour: extractValue(sunshineLatestHour)
    }
}

// Builds the URL to fetch a specific parameter from SMHI
const getVaddoObservations = async (parameterId: number) => {
    const url = `https://opendata-download-metobs.smhi.se/api/version/${API_VERSION}/parameter/${parameterId}/station/${VADDO_STATION_ID}/period/${PERIOD}/data.json`

    try {
        const response = await fetch(url)
        if (!response.ok)
            throw new Error(`[weather-api]SMHI API error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("[weather-api]Fetch from SMHI failed: ", error);
        return null;
    }
};

// Helper to extract values from json response
const extractValue = (data: any): number => {
    if (!data || !data.value || !data.value[0])
        return 0;
    return parseFloat(data?.value?.[0]?.value) ?? 0;
}

export async function getWeathers(lat: number, lon: number): Promise<Weather> {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`

    const response = await fetch(url);
    const data = await response.json() as Record<string, any>;

    const latest = data.timeSeries[0];

    const findParam = (name: string): number => {
        const p = latest.parameters.find((p: any) => p.name === name);
        return p ? p.values[0] : 0;
    }

    return {
        dewPoint: findParam('dpt'),
        dayTemp: {
            min: findParam('t'),
            max: findParam('t')
        },
        pressureHPa: findParam('msl'),
        stateOfGroundCode: 0,
        wind: findParam('ws'),
        windOrientDegrees: findParam('wd'),
        rainfallMonth: 0,
        rainfallDay: findParam('pmean') * 24,
        rainfallHour: findParam('pmean'),
        relativeHumidity: findParam('r'),
        sunshineLatestHour: findParam('tcc_mean')
    }
}
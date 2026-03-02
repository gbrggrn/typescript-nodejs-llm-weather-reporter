import { type Weather } from "../types/weather.type.js"


export async function getWeather(lat: number, lon: number): Promise<Weather> {
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
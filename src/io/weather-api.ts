import type { WeatherForecast } from "../types/weather-forecast.type.js";
import { type Weather } from "../types/weather.type.js"


export async function getWeatherData(lat: number, lon: number): Promise<any> {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`

    const response = await fetch(url);
   
    return await response.json();
}

export function getForecast(data: any, hours: number, label: string): WeatherForecast {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

    const bucket = data.timeSeries.filter((ts: any) => {
        const validTime = new Date(ts.validTime);
        return validTime <= endTime;
    });

    const getValues = (param: string) => bucket.map((ts:any) => 
        ts.parameters.find((p: any) => p.name === param)?.values[0] ?? 0
    );

    const temps = getValues('t');
    const rainFall = getValues('pmean');
    const wind = getValues('ws');
    const pressure = getValues('msl');
    const humidity = getValues('r');


    return {
        periodLabel: label,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        totalRain: rainFall.reduce((sum: number, val: number) => sum + val, 0), //NOTE: Sum of intensity
        avgWind: wind.reduce((sum: number, val: number) => sum + val, 0) / wind.length,
        avgPressure: pressure.reduce((sum: number, val: number) => sum + val, 0) / pressure.length,
        avgHumidity: humidity.reduce((sum: number, val: number) => sum + val, 0) / humidity.length
    }
}
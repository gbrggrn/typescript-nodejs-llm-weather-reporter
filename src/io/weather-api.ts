import { argv } from "node:process";
import type { WeatherForecast } from "../types/weather-forecast.type.js";
import { type Weather } from "../types/weather.type.js"


export async function getWeatherData(lat: number, lon: number): Promise<any> {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`

    const response = await fetch(url);
   
    return await response.json();
}

export function getForecast(
    data: any, 
    startOffset: number, 
    duration: number,
    label: string): WeatherForecast {
    const now = new Date();
    const startTime = new Date(now.getTime() + (startOffset * 60 * 60 * 1000))
    const endTime = new Date(startTime.getTime() + (duration * 60 * 60 * 1000));

    const bucket = data.timeSeries.filter((ts: any) => {
        const validTime = new Date(ts.validTime);
        return validTime >= startTime && validTime <= endTime;
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
        totalRain: calculateTotalVolume(bucket),
        avgWind: wind.reduce((sum: number, val: number) => sum + val, 0) / wind.length,
        avgPressure: avg(wind),
        avgHumidity: avg(humidity)
    }
}

function calculateTotalVolume(bucket: any): number {
    let totalVolume = 0;
    for (let i = 0; i < bucket.length; i++) {
        const current = new Date(bucket[i].validTime).getTime();
        const next = bucket[i+1] ? new Date(bucket[i+1].validTime).getTime() : current + (60 * 60 * 1000);
        const hoursGap = (next - current) / (1000 * 60 * 60);
    
        const intensity = bucket[i].parameters.find((p: any) => p.name === 'pmean')?.values[0] ?? 0;
        totalVolume += (intensity * hoursGap);
    }

    return totalVolume;
}

function avg(data: any): number {
    return data.reduce((sum: number, val: number) => sum + val, 0) / data.length
}
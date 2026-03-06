import type { WeatherForecast } from "../types/weather-forecast.type.js";

/**
 * Fetches a response from SMHIs pmp3g based on lon/lat.
 * @param lat latitude of the location to retrieve weather data from
 * @param lon longitude of the location to retrieve weather data from
 * @returns The JSON response from pmp3g (SMHI API)
 */
export async function getWeatherData(lat: number, lon: number): Promise<any> {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`

    const response = await fetch(url);
   
    return await response.json();
}

/**
 * Calculates the time window to retrieve data from.
 * Retrieves the values based on pmp3g parameters and formats to WeatherForecast before return.
 * @param data The time-series organized pmp3g JSON payload
 * @param startOffset The offset that marks the start of the time-series this call will calculate
 * @param duration How far from the startOffset this call is meant to calculate
 * @param label The label of the forecast this call will generate (ex. Immediate)
 * @returns Extracted data packaged as WeatherForecast
 */
export function getForecast(
    data: any, 
    startOffset: number, 
    duration: number,
    label: string): WeatherForecast {
    
    // Calculate the start-, and end time for this call
    const now = new Date();
    const startTime = new Date(now.getTime() + (startOffset * 60 * 60 * 1000))
    const endTime = new Date(startTime.getTime() + (duration * 60 * 60 * 1000));

    // Filter out the bucket that represents the time this call is to cover
    const bucket = data.timeSeries.filter((ts: any) => {
        const validTime = new Date(ts.validTime);
        return validTime >= startTime && validTime <= endTime;
    });

    // Helper to get the values from the time-series based on the API parameters
    const getValues = (param: string) => bucket.map((ts:any) => 
        ts.parameters.find((p: any) => p.name === param)?.values[0] ?? 0
    );

    // pmp3g parameters
    const temps = getValues('t');
    const rainFall = getValues('pmean');
    const wind = getValues('ws');
    const pressure = getValues('msl');
    const humidity = getValues('r');

    // Format and return
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

/**
 * Helper to calculate total volume (of rain) in a filtered bucket of time-series.
 * This is because pmp3g only returns intensity per time-series indice.
 * @param bucket The bucket of time-series indices to calculate on
 * @returns The total volume as a number (mm)
 */
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

/**
 * Helper to calculate avarage.
 * @param data data to perform the calculation on
 * @returns the avarage as a number
 */
function avg(data: any): number {
    return data.reduce((sum: number, val: number) => sum + val, 0) / data.length
}
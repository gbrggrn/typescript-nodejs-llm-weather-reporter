/**
 * The forecast package of standard types that the pmp3g JSON payload is converted to.
 */
export interface WeatherForecast {
    periodLabel: string,
    minTemp: number,
    maxTemp: number,
    totalRain: number,
    avgWind: number,
    avgPressure: number,
    avgHumidity: number
}
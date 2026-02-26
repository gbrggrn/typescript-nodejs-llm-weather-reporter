export interface Garden {
    weatherHistory: WeatherHistory
}

interface WeatherHistory {
    year: number,
    lastFrost: number,
    firstFrost: number,
}
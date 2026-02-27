export interface Weather {
    dayTemp: {
        min: number,
        max: number
    };
    rainfallMonth: number,
    rainfallDay: number,
    rainfallHour: number,
    pressureHPa: number,
    wind: number,
    windOrientDegrees: number,
    stateOfGroundCode: number,
    dewPoint: number,
    relativeHumidity: number,
    sunshineLatestHour: number
}
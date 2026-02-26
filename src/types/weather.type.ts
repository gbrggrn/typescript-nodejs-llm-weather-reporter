export interface Weather {
    dayTemp: {
        min: number,
        max: number
    };
    rainfallMm: number,
    pressureMbs: number,
    wind: number,
    riskOfThunder: number,
    soilTemp: number
}
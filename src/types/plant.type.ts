export interface Plant {
    readonly id: string,
    name: string,
    germinationTemp: {
        min: number,
        max: number
    };
    daysToGermination: {
        min: number,
        max: number
    };
    isFrostResistant: boolean,
    daysToMaturity: number;
}
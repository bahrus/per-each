export interface CountryMedalCountProps {
    rank: number;
    noc: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
}
export interface NationalMedalListProps {
    ishList: CountryMedalCountProps[];
    countryMedalCount: CountryMedalCountProps[];
    totalMedalCount: number;
}

export interface NationalMedalListActions {
    disp(self: NationalMedalListProps): void;
}
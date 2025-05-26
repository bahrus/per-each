export interface CountryMedalCountProps {
    rank: number;
    noc: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
    idx: number;
}

export interface CountryMedalCountActions {
    
}

export interface WorldRankingListProps {
    countryMedalCount: CountryMedalCountProps[];
    totalMedalCount: number;
}

export interface WorldRankingListActions {}
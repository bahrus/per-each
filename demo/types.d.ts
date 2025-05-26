export interface CountryProps {
    rank: number;
    noc: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
    idx: number;
}

export interface CountryActions {
    
}

export interface WorldRankingListProps {
    CountryMedalCount: CountryProps[];
    totalMedalCount: number;
}

export interface WorldRankingListActions {}
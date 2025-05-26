//@ts-check
/** @import {WorldRankingListProps, WorldRankingListActions} from './types' */
/** @import {IshConfig } from '../ts-refs/trans-render/froop/types' */

import {Scope} from 'trans-render/froop/Scope.js';
import {regIsh} from 'mount-observer/refid/regIsh.js';

/**
 * @implements {WorldRankingListActions}
 */
export class WorldRankingList extends Scope {
    /**
     * @type {IshConfig<WorldRankingListProps, WorldRankingListActions>}
     */
    static config = {
        propInfo: {
            totalMedalCount: {
                def: 0,
            },
        },
        xform:{
            '-o totalMedalCount': 0
        }
    };


    /**
     * 
     * @param {Scope & WorldRankingListProps} self 
     * @param {any[]} arr 
     */
    async 'arr=>'(self, arr){
        let returnArr = arr;
        if(!returnArr){
            returnArr = [
                {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
                {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
                {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
            ];
        }
        self.totalMedalCount = returnArr.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
        return super['arr=>'](self, returnArr);
    }
}

WorldRankingList.bootUp();
regIsh(document.body, 'WorldRankingList', WorldRankingList);
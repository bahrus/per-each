//@ts-check
/** @import {NationalMedalListProps, NationalMedalListActions} from './types' */
/** @import {IshConfig } from '../ts-refs/trans-render/froop/types' */

import {Scope} from 'trans-render/froop/Scope.js';

/**
 * @implements {NationalMedalListActions}
 */
export class NationalMedalList extends Scope {
    /**
     * @type {IshConfig<NationalMedalListProps, NationalMedalListActions>}
     */
    static config = {
        propInfo: {
            ishList: {
                def: [
                    {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
                    {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
                    {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
                ]
            },
        },
        compacts:{
            when_ishList_changes_call_disp: 0,
        },
        xform:{
            '-o totalMedalCount': 0
        }
    };

    disp(self){
        this.dispatchEvent(new Event('ishListChanged'));
    }
}

NationalMedalList.bootUp();
customElements.define('national-medal-list', NationalMedalList);
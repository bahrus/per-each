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
            ishList: {},
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
customElements.define('my-element', NationalMedalList);
//@ts-check
/** @import {CountryMedalCountProps, CountryMedalCountActions} from './types' */
/** @import {IshConfig } from '../ts-refs/trans-render/froop/types' */

import {Scope} from 'trans-render/froop/Scope.js';
import {regIsh} from 'mount-observer/refid/regIsh.js';

export class CountryMedalCount extends Scope {
    /**
     * @type {IshConfig<CountryMedalCountProps, CountryMedalCountActions>}
     */
    static config = {
        propInfo:{
            rank: {}, noc: {}, gold: {}, silver: {}, bronze: {}, total: {}, idx: {},
        },
        xform: {
            ':root': [
                {o: 'idx', s: 'ariaRowIndex'},
            ],
            '| rank': 0, '| noc': 0, '| gold': 0, '| silver': 0, '| bronze': 0, '| total': 0,
        },
        inScopeXForms: {
            '.totals': {
                '| total': 0
            }
        }
    }
}

CountryMedalCount.bootUp();
regIsh(document, 'country-medal-count', CountryMedalCount);

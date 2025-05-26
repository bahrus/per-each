//@ts-check
/** @import {CountryProps, CountryActions} from './types' */
/** @import {IshConfig } from '../ts-refs/trans-render/froop/types' */

import {Scope} from 'trans-render/froop/Scope.js';
import {regIsh} from 'mount-observer/refid/regIsh.js';

export class Country extends Scope {
    /**
     * @type {IshConfig<CountryProps, CountryActions>}
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

Country.bootUp();
regIsh(document.body, 'Country', Country);

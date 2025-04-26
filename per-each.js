// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/per-each/types' */;

/**
 * @implements {Actions}
 * 
 */
class PerEach extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propInfo:{
            ...propInfo,
            statement: {}
        },
        compacts: {
            when_statement_changes_call_parse: 0,
        },
        actions: {
            hydrate: {
                ifAllOf: ['itemProp', 'listProp'],
            }
        },
        positractions: [resolved, rejected],
    }

    de = de;

    parse(self){
        const { statement } = self;
        const split = statement.split(' of ').map(s => s.trim());
        const [itemProp, listProp] = split;
        return /** @type {PAP} */({
            itemProp, listProp
        });
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self) {
        const { itemProp, listProp, enhancedElement } = self;
        console.log('in hydrate');
        const closest = enhancedElement.closest(`[itemscope="${listProp}"`);
        console.log({closest});
        return /** @type {PAP} */({
            resolved: true
        });
    }
}

await PerEach.bootUp();
export { PerEach };
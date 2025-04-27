// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
import { EventHandler } from 'trans-render/EventHandler.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/per-each/types' */;
/** @import {HasIsh} from './ts-refs/trans-render/dss/types' */

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class PerEach extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propInfo:{
            ...propInfo,
            statement: {},
            itemProp:{},
            listProp:{},
            ish:{},
            mapIdxTo:{},
            idxStart:{def: 0},
            itemTemplate:{}, 
        },
        compacts: {
            when_statement_changes_call_parse: 0,
        },
        actions: {
            init: {
                ifAllOf: ['itemProp', 'listProp'],
            },
            hydrate: {
                ifAllOf: ['ish', 'itemTemplate'],
            },
        },
        positractions: [resolved, rejected],
    }

    de = de;

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
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
    async init(self) {
        const { itemProp, listProp, enhancedElement } = self;
        const closest = enhancedElement.closest(`[itemscope="${listProp}"`);
        if(closest === null) throw 404;
        /**
         * @type {EventTarget}
         */
        let ish;
        if(!('ish' in closest) || !(closest.ish instanceof EventTarget)){
            const {waitForIsh} = await import('mount-observer/waitForIsh.js');
            ish = await waitForIsh(closest);
        }else{
            ish = closest.ish;
        }
        let itemTemplate = enhancedElement;
        if(!(itemTemplate instanceof HTMLTemplateElement)){
            throw 'NI';
        }
        return /** @type {PAP} */({
            ish,
            itemTemplate
        });
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    hydrate(self){
        const {ish} = self;
        ish.addEventListener('ishListChanged', this);
        this.handleEvent();
        return /** @type {PAP} */({
            resolved: true
        });
    }

    async handleEvent(){
        const self = /** @type {BAP} */(/** @type {any} */(this));
        const {ish, enhancedElement, itemProp, mapIdxTo, idxStart, itemTemplate} = self;
        const {ishList} = ish;
        if(ishList === undefined) return;
        //for now, assume enhanced element is a template
        //TODO build template element first
        const {bindish} = await import('mount-observer/bindish.js');
        //TODO, use after
        const parent = enhancedElement.parentElement;
        let idx = idxStart;
        for(const item of ishList){
            /**
             * @type {DocumentFragment}
             */
            const clone =  /**@type {any} */(itemTemplate.content.cloneNode(true));
            //TODO:  modify template element so don't have to do this with every loop
            /** @type {HasIsh & Element} */
            const firstElementChild = /** @type {any} */(clone.firstElementChild);
            if(firstElementChild === null) throw 404;
            firstElementChild.ish = item;
            if(mapIdxTo !== undefined){
                firstElementChild.ish[mapIdxTo] = idx++;
            }
            firstElementChild.setAttribute('itemscope', itemProp);
            await bindish(clone); //TODO assign gingerly
            //TODO optimize with a fragment
            //TODO wait for element to raise event "resolved"
            parent?.appendChild(clone);
        }
    }
}

await PerEach.bootUp();
export { PerEach };
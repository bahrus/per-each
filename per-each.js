// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
import { EventHandler } from 'trans-render/EventHandler.js';
import { assignGingerly } from 'trans-render/lib/assignGingerly.js';
import { Scope } from 'trans-render/froop/Scope.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/per-each/types' */;
/** @import {HasIsh} from './ts-refs/mount-observer/types' */
/** @import {Clone$Options} from './ts-refs/trans-render/types.js' */
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
            each: {},
            itemProp:{},
            listProp:{},
            ish:{},
            mapIdxTo:{},
            idxStart:{def: 1},
            itemTemplate:{},
            emc: {},
            idleTimeout: {},
        },
        compacts: {
            when_each_changes_call_parse: 0,
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
        const { each, enhancedElement} = self;
        const split = each.split(' of ').map(s => s.trim());
        let [itemProp, listProp] = split;
        if(listProp === undefined){
            const inferredList = enhancedElement.closest('[itemscope]:not([itemscope=""])');
            if(inferredList === null) throw 404;
            listProp = inferredList.getAttribute('itemscope') || '';
        }
        if(!itemProp && enhancedElement instanceof HTMLScriptElement && enhancedElement.hasAttribute('href')){
            itemProp = enhancedElement.getAttribute('href')?.substring(1);
        }
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
        const { itemProp, listProp, enhancedElement, emc } = self;
        const closest = enhancedElement.closest(`[itemscope="${listProp}"`);
        if(closest === null) throw 404;
        let itemTemplate = enhancedElement;
        const isScriptEl = enhancedElement instanceof HTMLScriptElement;
        if(isScriptEl && enhancedElement.hasAttribute('href')) {
            itemTemplate = itemTemplate.previousElementSibling;
            const {ScopeScript} = await import('trans-render/froop/ScopeScript.js');
            await ScopeScript(enhancedElement);
            // try{
            //     await ScopeScriptImpl(enhancedElement, listProp);
            // }catch(e){}
        }
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

        if(!(itemTemplate instanceof HTMLTemplateElement)){
            /**
             * @type {HTMLTemplateElement}
             */
            const itemTemplate2 = document.createElement('template');
            enhancedElement.removeAttribute('itemscope');
            itemTemplate2.innerHTML = itemTemplate.outerHTML;
            const {base} = emc;
            const {branches} = emc;
            for(const branch of branches){
                const app = branch ? `-${branch}` : '';
                itemTemplate2.content.firstElementChild?.removeAttribute(`${base}${app}`);
            }
            
            let elementToHide = isScriptEl ? itemTemplate : enhancedElement;
            if(isScriptEl){
                elementToHide.remove();
            }else{
                elementToHide.innerHTML = '';
                if('hidden' in elementToHide){
                    elementToHide.hidden = true;
                }
            }

            itemTemplate = itemTemplate2;
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
    async hydrate(self){
        const {ish, itemProp, mapIdxTo, idxStart, itemTemplate, emc, idleTimeout, enhancedElement} = self;
        const {Clone$} = await import('trans-render/trHelpers/Clone$.js');
        /**
         * @type {Clone$Options}
         */
        const cloneOptions = {
            itemProp,
            mapIdxTo,
            idxStart,
            itemTemplate,
            baseCrumb: emc.base,
            idleTimeout,
            seedEl: enhancedElement,
            ish,
            ishContainer: enhancedElement,
            //csr: true,
        };
        new Clone$(cloneOptions);
    }


}

await PerEach.bootUp();
export { PerEach };
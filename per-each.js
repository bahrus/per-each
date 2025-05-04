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
        const { each} = self;
        const split = each.split(' of ').map(s => s.trim());
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
        const { itemProp, listProp, enhancedElement, emc } = self;
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
            /**
             * @type {HTMLTemplateElement}
             */
            const itemTemplate2 = document.createElement('template');
            itemTemplate2.innerHTML = enhancedElement.outerHTML;
            const {base} = emc;
            itemTemplate2.content.firstElementChild?.removeAttribute(base);
            enhancedElement.removeAttribute('itemscope');
            enhancedElement.innerHTML = '';
            if('hidden' in enhancedElement){
                enhancedElement.hidden = true;
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
        const {ish, enhancedElement, itemProp, mapIdxTo, idxStart, itemTemplate, emc, idleTimeout} = self;
        const {ishList} = ish;
        if(ishList === undefined) return;
        const {bindish} = await import('mount-observer/bindish.js');
        const parent = enhancedElement.parentElement;
        let idx = idxStart;
        const {waitForIdleNodes} = await import('mount-observer/MountObserver.js');
        const fragment = document.createDocumentFragment();
        /**
         * @type {Array<Node>}
         */
        const nodesWeWantToWaitFor  = [];
        const existingIshNodes = [];
        let ns = enhancedElement;
        while(ns !== null){
            if(ns.getAttribute('itemscope') === itemProp){
                existingIshNodes.push(ns);
            }
            ns = ns.nextElementSibling;
        }
        let absIdx = 0;
        let isOutOfRange = false;
        let lastExisting = enhancedElement;
        for(const item of ishList){
            if(!isOutOfRange){
                const existingIshNode = existingIshNodes[absIdx];
                if(existingIshNode !== undefined){
                    existingIshNode.ish = item;
                    lastExisting = existingIshNode;
                    absIdx++;
                    continue;
                }else{
                    isOutOfRange = true;
                }
            }
            absIdx++;
            let templToClone = itemTemplate;
            const externalRefId = templToClone.dataset.blowDryRef;
            if (externalRefId){
                templToClone = window[externalRefId];
            }
                
            /**
             * @type {DocumentFragment}
             */
            const clone =  /**@type {any} */(itemTemplate.content.cloneNode(true));
            const children = Array.from(clone.children);
            children.forEach(c => {nodesWeWantToWaitFor.push(c)});
            //TODO:  modify template element so don't have to do this with every loop
            /** @type {HasIsh & Element} */
            const firstElementChild = /** @type {any} */(clone.firstElementChild);
            if(firstElementChild === null) throw 404;
            firstElementChild.ish = item;
            if(mapIdxTo !== undefined){
                firstElementChild.ish[mapIdxTo] = idx++;
            }
            firstElementChild.setAttribute('itemscope', itemProp);
            if(children.length > 1){
                const {base} = emc;
                let itemref = firstElementChild.getAttribute('itemref') || '';
                for(let i = 1, ii = children.length; i < ii; i++){
                    const child = children[i];
                    if(!child.id){
                        const {getCount} = await import('trans-render/dss/tref/getCount.js');
                        child.id = `${base}-${getCount(base + '')}`;
                        
                        itemref += ' ' + child.id;
                    }
                }
                firstElementChild.setAttribute('itemref', itemref.trim());
            }
            await bindish(clone, {
                csr: true,
            }); //TODO assign gingerly
            //TODO:  max buffer size
            fragment.appendChild(clone);
        }
        if(absIdx < existingIshNodes.length){
            const {deleteEl} = await import('trans-render/dss/tref/deleteEl.js');
            for(let i = absIdx; i < existingIshNodes.length; i++){
                const existingIshNode = existingIshNodes[i];
                if(existingIshNode.hasAttribute('itemref')){
                    deleteEl(existingIshNode);
                }else{
                    existingIshNode.remove();
                }
                
            }
        }
        await waitForIdleNodes(nodesWeWantToWaitFor, idleTimeout);
        if(lastExisting.hasAttribute('itemref')){
            const {tail} = await import('trans-render/dss/tref/tail.js');
            lastExisting = tail(lastExisting);
        }
        lastExisting.after(fragment);
    }
}

await PerEach.bootUp();
export { PerEach };
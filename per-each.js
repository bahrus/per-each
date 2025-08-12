// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {Actions, PAP, AllProps, AP, BAP, LoopingParameters} from './ts-refs/per-each/types' */;
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
            // itemProp:{},
            // listProp:{},
            //ish:{},
            mapIdxTo:{},
            idxStart:{def: 1},
            itemTemplates:{},
            emc: {},
            idleTimeout: {},
            //ishContainer: {},
            // rawStatements: {},
            // parsedStatements: {},
            // loopingParameters: {},
        },
        compacts: {
            when_each_changes_call_parse: 0,
        },
        actions: {
            init: {
                ifAllOf: ['parsedStatements'],
            },
            hydrate: {
                ifAllOf: ['itemTemplates', 'loopingParameters'],
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
        let [itemScopesS, listProp] = split;
        const itemScopes = itemScopesS.split(',').map(s => s.trim()).filter(s => !!s);
        if(listProp === undefined){
            const inferredList = enhancedElement.closest('[itemscope]:not([itemscope=""])');
            if(inferredList === null) throw 404;
            listProp = inferredList.getAttribute('itemscope') || '';
        }
        // if(!itemProp && enhancedElement instanceof HTMLScriptElement && enhancedElement.hasAttribute('href')){
        //     itemProp = enhancedElement.getAttribute('href')?.substring(1);
        // }
        return /** @type {PAP} */({
            itemScopes, listProp
        });
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async init(self) {
        const { itemScopes, listScope, enhancedElement, emc } = self;
        const ishContainer = enhancedElement.closest(`[itemscope="${listScope}"`);
        if(ishContainer === null) throw 404;
        let itemTemplates = /** @type {Array<HTMLTemplateElement>} */ ( /**  @type {any} */ ([enhancedElement]));
        // const isScriptEl = enhancedElement instanceof HTMLScriptElement;
        // if(isScriptEl && enhancedElement.hasAttribute('href')) {
        //     itemTemplate = itemTemplate.previousElementSibling;
        //     const {ScopeScript} = await import('trans-render/froop/ScopeScript.js');
        //     await ScopeScript(enhancedElement);
        //     // try{
        //     //     await ScopeScriptImpl(enhancedElement, listProp);
        //     // }catch(e){}
        // }
        /**
         * @type {EventTarget}
         */
        let ish;
        if(!('ish' in ishContainer) || !(typeof(ishContainer.ish) !== 'function')){
            const {waitForIsh} = await import('mount-observer/waitForIsh.js');
            ish = await waitForIsh(ishContainer);
        }else{
            ish = ishContainer.ish;
        }

        if(!(enhancedElement instanceof HTMLTemplateElement)){
            if(itemScopes.length > 1) {
                throw 'NI';
            }
            /**
             * @type {HTMLTemplateElement}
             */
            const itemTemplate2 = document.createElement('template');
            enhancedElement.removeAttribute('itemscope');
            itemTemplate2.innerHTML = enhancedElement.outerHTML;
            const {base} = emc;
            const {branches} = emc;
            for(const branch of branches){
                const app = branch ? `-${branch}` : '';
                itemTemplate2.content.firstElementChild?.removeAttribute(`${base}${app}`);
            }
            
            //let elementToHide = isScriptEl ? itemTemplate : enhancedElement;
            // if(isScriptEl){
            //     elementToHide.remove();
            // }else{
            //     elementToHide.innerHTML = '';
            //     if('hidden' in elementToHide){
            //         elementToHide.hidden = true;
            //     }
            // }
            enhancedElement.innerHTML = '';
            if('hidden' in enhancedElement){
                enhancedElement.hidden = true;
            }

            itemTemplates = [itemTemplate2];
        }else if(itemScopes.length > 1){
            itemTemplates = /** @type {Array<HTMLTemplateElement>} */ (Array.from(/** @type {any} */(enhancedElement).remoteContent.querySelectorAll('template')));
            if(itemTemplates.length !== itemScopes.length) throw 'NI';
        }
        return /** @type {PAP} */({
            ish,
            itemTemplates,
            ishContainer
        });
    }

    // /**
    //  * 
    //  * @param {BAP} self 
    //  * @returns 
    //  */
    // async init(self){
    //     const {parsedStatements, enhancedElement} = self;
    //     // iterate through all the parsedStatements and fill in the listProp if not specified
    //     /** @type {string | undefined} */
    //     let defaultListProp;
    //     /** @type Array<LoopingParameters> */
    //     const loopingParameters = [];
    //     for(const statement of parsedStatements){
    //         let {listProp, itemProp} = statement;
    //         if(listProp === undefined){
    //             if(defaultListProp === undefined){
    //                 const inferredList = enhancedElement.closest('[itemscope]:not([itemscope=""])');
    //                 if(inferredList === null) throw 404;
    //                 defaultListProp = inferredList.getAttribute('itemscope') || '';
    //             }
    //             //statement.listProp = defaultListProp;
    //             listProp = defaultListProp;
    //         }
    //         const ishContainer = enhancedElement.closest(`[itemscope="${listProp}"`);
    //         if(ishContainer === null) throw 404;
    //         let ish;
    //         if(!('ish' in ishContainer) || !(typeof(ishContainer.ish) !== 'function')){
    //             const {waitForIsh} = await import('mount-observer/waitForIsh.js');
    //             ish = await waitForIsh(ishContainer);
    //         }else{
    //             ish = ishContainer.ish;
    //         }
    //         loopingParameters.push({
    //             ish,
    //             ishContainer,
    //             listProp,
    //             itemProp
    //         });
    //     }



    //     return /** @type {PAP} */({
    //         loopingParameters
    //     });
    // }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        const {
            ish, itemProp, mapIdxTo, idxStart, itemTemplate, emc, idleTimeout,
            enhancedElement, ishContainer
        } = self;
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
            ishContainer,
            //csr: true,
        };
        new Clone$(cloneOptions);
    }


}

await PerEach.bootUp();
export { PerEach };
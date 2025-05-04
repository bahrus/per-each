// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/per-each/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'per-each',
    branches: ['', 'map-idx-to', 'idx-start', 'idle-timeout', 'options'],
    enhPropKey: 'perEach',
    map: {
        '0.0':{
            instanceOf: 'String',
            mapsTo: 'each',
        },
        '1.0': {
            instanceOf: 'String',
            mapsTo: 'mapIdxTo',
        },
        '2.0': {
            instanceOf: 'String',
            mapsTo: 'idxStart', 
        },
        '3.0': {
            instanceOf: 'Number',
            mapsTo: 'idleTimeout'
        },
        '4.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        },

    },
    importEnh: async () => {
        const { PerEach } = await import('./per-each.js');
        return PerEach;
    },
    mapEmcTo: 'emc'
};

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose); 
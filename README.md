# per-each (🍑) [WIP]


[![Playwright Tests](https://github.com/bahrus/per-each/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/per-each/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/per-each.png)](http://badge.fury.io/js/per-each)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/per-each?style=for-the-badge)](https://bundlephobia.com/result?p=per-each)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/per-each?compression=gzip">

*per-each* is a custom element enhancement, based on the [be-enhanced](https://github.com/bahrus/be-enhanced) family of [behiviors](https://github.com/bahrus/be-hive), that 

1.  Provides for looping support, but
2.  Imposes little to no requirements as far as binding syntax.
3.  Promotes use of  light-weight classes or function prototypes for encapsulating logic and binding as needed (that is part of a standards proposal), while
4.  Working around limitations of proper HTML decorum.
5.  It can "resume" rendering from server-rendered HTML based on WHATWG standard microdata attributes (with a small enhancement proposal)

## Avoiding the framework trap

On the web presentation layer, since there is no built-in web standard support for dynamically generating a loop of HTML on the client side, developers naturally flock to a library / framework for this functionality.  And that typically involves abiding by some proprietary syntax for all binding.  And *poof*, the developer gets sucked into a framework with no possibility of escape.

Custom Elements have made great inroads in avoiding the framework trap.  Each component can adopt any binding syntax it wants within the Shadow DOM realm.   However, they fall short when it comes to generating the light children, without a little nudge.

This enhancement provides that nudge.  It builds on [a proposal](https://github.com/WICG/webcomponents/issues/1000) that provides a common mechanism for binding a view model to the UI -- the ability for a class instance or function prototype to be attached automatically to an element based on the itemscope attribute, so it can manage the light children of the adorned element.

## Example 1 -- No template

Example:  Suppose we want to display the medal count and details of the last Olympics, using the HTML table element.

This could look as follows:

```html
<body>
    ...
    <table itemscope=worldRankingList>
        <thead>
            <tr>
                <th>Rank</th>
                <th>NOC</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Bronze</th>
                <th>Total</th>
        </thead>
        <tbody>
            <tr 
                per-each="country of worldRankingList">
                <td itemprop=rank></td>
                <td itemprop=noc></td>
                <td itemprop=gold></td>
                <td itemprop=silver></td>
                <td itemprop=bronze></td>
                <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
            </tr>
        </tbody>
    </table>
</body>
```

*per-each* looks at the element it adorns, the tr element, and turns it into a template.  *per-each* also supports enhancing template elements, which is required for repeating multiple side-by-side elements per loop iteration.

All that *per-each* does is clone the tr element multiple times, and set the attribute for each one, and it passes each list item to the "ish" property of each such tr element:

```html
<table itemscope=worldRankingList>
    <thead>
        ...
    </thead>
    <tbody>
        <tr itemscope=country>
            ...
        </tr>
        <tr itemscope=country>
            ...
        </tr>
    </tbody>
</table>
```

"ish" stands for **i**tem**s**cope **h**ost.

Being that *per-each* is a  *be-hive* based custom enhancement, that builds on [*mount-observer*](https://github.com/bahrus/mount-observer), which is a polyfill for [another proposal](https://github.com/WICG/webcomponents/issues/896), each such  itemscope attribute:

1.  Causes the instantiation of a class or function prototype registered by that name....
2.  ... which gets attached to the element the itemscope attribute adorns, with dynamic property key "ish"

What makes the "ish" property a bit interesting as a property, is that the setter for ish doesn't actually replace the ish class instance, but rather does an Object.assign / shallow merge (?) of the passed in object into the class instance.  That is, that's what happens if the object being passed in is *not* an array.

In the case of getting passed in an array, the ish property setter sets the class instances's "ishList" property.  So these "scoped class or function prototype instances" that wish to provide a list of data are expected to follow the convention of reserving that property with name "ishList", which *per-each* assumes.

Implementing these conventions takes a certain amount of boilerplate effort, shown below.  However, a small library or base class or two can easily make developing such cookie cutter classes or function prototypes trivial:

```JavaScript
import {regIsh, sym} from 'mount-observer/refid/regIsh.js';

regIsh(document.body, 'worldRankingList', class {

    async 'arr=>'(self, arr){
        /**
        * Typically the list of data will be passed in via the oElement.ish property,
        * or retrieved internally via fetch, for example
        */
       const returnArr = arr;
       if(returnArr === undefined){
            returnArr = [
                {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
                {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
                {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
                ...
            ];
       }
       this.#calculateTotal(returnArr)
       return returnArr;
    }


    /** just an example, entirely optional */
    #calculateTotal(arr){
        this.#totalMedalCount = arr.reducer((accumulator, currentValue) => accumulator + currentValue.total));
    }

    #totalMedalCount;
    get totalMedalCount(){
        return this.#totalMedalCount;
    }
    '<mount>'(self, el){
        //do any rendering / event handling  that is desired on the element
        //To update the list:
        el.ish = [...newList]
    }
});


regIsh(document.body, 'country', class {

    /** Optional.  First element of cloned template gets passed in here **/
    /** For server rendered HTML, the element with itemscope attribute = country
     * in this case gets passed in
     */
    async '<mount>'(self, element, {csr: true/false}){
        //binding / event handling added here if needed 
    }

    /** Optional.  
        * Any elements other than the first element of the template 
        * gets passed in here.
        * For SSR generated content, elements get passed in via the itemref attribute references:*/
    async '<inScope>'(self, element){
        //binding / event handling added here
    }

});



```

The HTML markup in the example is used in the demo examples of this package, and in those demo's the *country* class or function prototype chooses to use microdata ("itemprop") for binding clues. But *per-each* doesn't really care about that, and doesn't look for any itemprop attributes (only itemscope).  It just needs a class or function prototype that implements:

```JavaScript
interface Ishcycle{
    /** optional */
    '<mount>'?(self:this, el: Element, {csr?: boolean /* TODO */}): Promise<void>;
    /** optional */
    '<inScope>'?(self: this, el: Element): Promise<void>;
    /** optional */
    'arr=>'?(
        self: Ishcycle, arr: any[] | undefined, 
        el: Element & HasIsh, 
        options: BindishOptions)
        : Promise<void | any[]>;
}
```
... in the case of each iterating item, and

```JavaScript
interface IshcycleList extends Ishcycle{
    ishList?: any[];
}
```

... in the case of the DOM element that holds, and manipulates, and possibly retrieves the list from which the *per-each* looping derives.

## Libraries that help with developer ergonomics

What we've seen above is that there is a certain amount of ceremony required to define the custom classes and/or function prototypes that are needed for per-each to be able to work.  If *per-each* is used frequently, it is advisable to use a helper library to reduce the boilerplate necessary, and the demos in this package do use such a helper library, which builds on [trans-rendering](https://github.com/bahrus/trans-render/wiki/V.--Mount%E2%80%90observing-transforms).



## Referencing the count

```html
<table itemscope=worldRankingList>
    <thead>
        <tr>
            <th>Rank</th>
            <th>NOC</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Total</th>
    </thead>
    <tbody>
        <tr 
            per-each="country of worldRankingList" 
            per-each-map-idx-to="myIndex"
            per-each-idx-start="1">
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
        
    </tbody>
</table>
```

This sets property "myIndex" of each ish-based class or function prototype equal to the index, with an optional starting index specified as above (defaults to 1).

As you can see, the markup gets a little clunky when specifying numerous options.  Two things can be done to reduce the manual effort in configuring the component:

1.  Adopt a smaller name
2.  Utilize the options setting

It is easy to define an alternative name for this enhancement that can be used in less formal setting -- names that aren't registered in some package management system like npm, that may conflict with other libraries.

One alternative name that this package supports is the emoji:  🍑.

Also, there's one setting that allows all the others to be specified via the more compact (but more error prone, less semantic) JSON.  So the example above:

```html
<tr 
    per-each="country of worldRankingList" 
    per-each-map-idx-to="myIndex"
    per-each-idx-start="1"
>
...
</tr>
```

... can be mocked up as:

```html
<tr 
    🍑-options='{
        "each": "country of worldRankingList",
        "mapIdxTo": "myIndex",
        "idxStart": 1
    }'
>
...
</tr>
```

## SSR

Due to the heavy reliance on HTML attributes to keep things in sync, this element enhancement integrates seamlessly with server rendered html.  For example, expand the section below to see what works:

<details>
    <summary>Sample SSR example</summary>

```html
<table itemscope=worldRankingList>
    <caption>Medal List Summer 2024</caption>
    <thead>
        <tr>
            <th></th>
            <th>Rank</th>
            <th>NOC</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <template 
            per-each="country of worldRankingList"
            per-each-map-idx-to="idx"
            per-each-idx-start="1"
        >
            <tr>
                <td itemprop=rank></td>
                <td itemprop=noc></td>
                <td itemprop=gold></td>
                <td itemprop=silver></td>
                <td itemprop=bronze></td>
                <td><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
            </tr>

        </template>
        <tr itemscope=country>
            <td itemprop=rank>tbd 1</td>
            <td itemprop=noc>tbd 1</td>
            <td itemprop=gold>tbd 1</td>
            <td itemprop=silver>tbd 1</td>
            <td itemprop=bronze>tbd 1</td>
            <td><span itemprop=total>tbd</span> of <span -o=totalMedalCount>tbd</span></td>
        </tr>
        <tr itemscope=country>
            <td itemprop=rank>tbd 2</td>
            <td itemprop=noc>tbd 2</td>
            <td itemprop=gold>tbd 2</td>
            <td itemprop=silver>tbd 2</td>
            <td itemprop=bronze>tbd 2</td>
            <td><span itemprop=total>tbd</span> of <span -o=totalMedalCount>tbd</span></td>
        </tr>
        <tr itemscope=country>
            <td itemprop=rank>tbd 3</td>
            <td itemprop=noc>tbd 3</td>
            <td itemprop=gold>tbd 3</td>
            <td itemprop=silver>tbd 3</td>
            <td itemprop=bronze>tbd 3</td>
            <td><span itemprop=total>tbd</span> of <span -o=totalMedalCount>tbd</span></td>
        </tr>
        <tr  itemscope=country>
            <td itemprop=rank>tbd 4</td>
            <td itemprop=noc>tbd 4</td>
            <td itemprop=gold>tbd 4</td>
            <td itemprop=silver>tbd 4</td>
            <td itemprop=bronze>tbd 4</td>
            <td><span itemprop=total>tbd</span> of <span -o=totalMedalCount>tbd</span></td>
        </tr>
    </tbody>
</table>
```

</details>

## Inference

If the name of the itemscope list isn't provided, it is inferred.  This can reduce things getting out of sync when refactoring takes place:

```html
<table itemscope=worldRankingList>
    <thead>
        <tr>
            <th>Rank</th>
            <th>NOC</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
            <th>Total</th>
    </thead>
    <tbody>
        <tr 
            per-each="country" >
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
    </tbody>
</table>
```

## Casual Fridays

The examples so far allow for any class or function prototype library that abides by the minimal protocol mentioned above.  

But *per-each* also provides some extra support to make the developer extra productive.

Expand the markup below to see what that looks like

<details>
    <summary>Boilerplate busting iterating</summary>

```html
<script nomodule id=worldRankingList>
({
    propInfo: {
        ishList: {
            def: [
                {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
                {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
                {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
            ]
        },
        totalMedalCount: {
            def: 0,
        },
    },
    compacts:{
        when_ishList_changes_dispatch: 'ishListChanged'
    },
    actions:{
        calcTotal: {
            ifAllOf: ['ishList'],
            do: ({ishList}) => ({
                totalMedalCount: ishList.reduce((acc, item) => acc + item.total, 0)
            }),
            
        }
    },
    xform:{
        '-o totalMedalCount': 0
    }
})
</script>
        
<script nomodule id="country" href=#worldRankingList>
({
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
})
</script>

<table itemscope=worldRankingList>
    <caption>Medal List Summer 2024</caption>
    <thead>
        <tr>
            <th>Rank</th>
            <th>NOC</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
        <script href="#country" 🍑></script>
    </tbody>
</table>
```

</details>

## Viewing Locally

Any web server that serves static files with server-side includes will do but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Install Python 3 or later.
5.  Open command window to folder where you cloned this repo.
6.  > npm install
7.  > npm run serve
8.  Open http://localhost:8000/demo in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'per-each/per-each.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/per-each';
</script>
```


# per-each (🍑) [WIP]

*per-each* is a custom element enhancement, based on the [be-enhanced](https://github.com/bahrus/be-enhanced) family of [behiviors](https://github.com/bahrus/be-hive), that 

1.  Provides for looping support, 
2.  Imposes little to no requirements as far as binding syntax.
3.  Promotes use of custom elements for encapsulating logic and binding as needed, while
4.  Working around limitations of proper HTML decorum.
5.  It can "resume" rendering from server-rendered HTML based on WHATWG standard microdata attributes

## Avoiding the framework trap

On the web presentation layer, since there is no built-in web standard support for dynamically generating a loop of HTML on the client side, developers naturally need to gravitate to a library / framework for this functionality.  And that typically involves abiding by some syntax for all binding.  And like that, the developer gets sucked into a framework with no possibility of escape.

Custom Elements have made great inroads in avoiding the framework trap.  However, they fall short when it comes to generating the light children, without a little nudge.

This enhancement, instead, builds on [a proposal](https://github.com/WICG/webcomponents/issues/1000) that gives custom elements that nudge -- the ability to be attached automatically referenced by the itemscope attribute.

## Example 1 -- No template

Example:  Suppose we want to display the medal count and details of the last Olympics, using the HTML table element.

This could look as follows:

```html
<table itemscope=national-medal-list>
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
            per-each="country-medal-count of national-medal-list" -s=aria-rowindex>
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

*per-each* looks at the element it adorns, the tr element, and turns it into a template.  *per-each* also supports template elements, which is required for repeating multiple side-by-side elements per loop iteration.

All that *per-each* does is clone the tr element multiple times, and set the attribute for each one:

```html
<table itemscope=national-meal-list>
    <thead>
        ...
    </thead>
    <tbody>
    <tr itemscope=country-medal-count>
        ...
    </tr>
    <tr itemscope=country-medal-count>
        ...
    </tr>
</table>
```

Being that *per-each* is a  *be-hive* based custom enhancement, that builds on *mount-observer*, which is a polyfill for [another proposal](https://github.com/WICG/webcomponents/issues/896), those itemscope attributes:

1.  Instantiate a custom element by that name.
2.  Attaches that custom element to the element it adorns, with property "ish"
3.  In the case of lists, follows a convention that can be leveraged by multiple libraries

Implementing these conventions takes a certain amount of boilerplate effort, shown below.  However, a small library or base class or two can easily make developing such custom elements trivial:

```html
<script>
    customElements.define('national-medal-list', class {
        
        #ishList = [
            {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
            {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
            {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
            ...
        ];
 
        /** optional */
        get ishList(){
            return this.#ishList;
        }
        set ishList(nv){
            //we could filter the list if applicable first
            this.#ishList = nv;
            this.#calculateTotal();
            this.dispatchEvent(new Event('ishListChanged'));
        }

        /** just an example, entirely optional */
        #calculateTotal(){
            if(this.#ishList.reducer((accumulator, currentValue) => accumulator + currentValue.total));
        }

        #totalMedalCount;
        get totalMedalCount(){
            return this.#totalMedalCount;
        }
        attachedCallback(enhancedEl){
            //do any rendering that is desired on the enhancedEl
        }
    });
    customElements.define('country-medal-count', class {
        //view model that gets passed in goes here by default
        #ish
        /** optional */
        get ish(){
            return this.#ish;
        }

        set ish(nv){
            this.#ish = nv;
            //do whatever the custom element wants to do as far as binding the values of ish 
            //to the firstElementOfClonedElement, and adding needed bindings and to additional elements linked via itemref if applicable
            //once finished, raise an event "resolved" at least the first time
            // so the looping mechanism knows it is ready to add to the live DOM tree:

        }

        /** Optional.  First element of cloned template gets passed in here **/
        async attachedCallback(element){
            //binding / event handling added here if needed 
        }

        /** Optional.  Elements related via the itemref attribute get passed in here:*/
        async inScopeCallback(element){
            //binding / event handling added here
        }

    });

</script>
<table itemscope=national-medal-list>
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
            per-each="country-medal-count of national-medal-list" -s=aria-rowindex>
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

This markup is used in the demo examples of this package, and in those demo's the *country-medal-count* custom element chooses to use microdata ("itemprop") for binding clues, but *per-each* doesn't really care about that, and doesn't look for any itemprop attributes (only itemscope).  It just needs a custom element that implements:

```JavaScript
interface IshFace{
    /** optional */
    attachedCallback?(el: Element): Promise<void>;
    /** optional */
    inScopeCallback?(el: Element): Promise<void>;
    /*  optional */
    ish?: any;
}
```
... in the case of each iterating item, and

```JavaScript
interface IshListFace extends IshFace{
    ishList?: any[];
}
```

... that emits event "ishListChanged" when a new list is to be applied, in the case of the DOM element that holds, and manipulates, and possibly retrieves the list.

## Libraries that help with developer ergonomics

What we've seen above is that there is a certain amount of ceremony required to define the custom elements that are needed for per-each to be able to work.  If *per-each* is used frequently, it is advisable to use a helper library to reduce the boilerplate necessary, and the demos in this package do use such a helper library, which builds on [trans-rendering](https://github.com/bahrus/trans-render/wiki/V.--Mount%E2%80%90observing-transforms).



## Referencing the count

```html
<table itemscope=national-medal-list>
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
            per-each="country-medal-count of national-medal-list" 
            per-each-map-idx-to="myIndex"
            per-each-idx-start="1" 
            -s=aria-rowindex>
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
        <tr>
        </tr>
        <tr>
        </tr>
    </tbody>
</table>
```

This sets property "myIndex" of each ish-based custom element equal to the index, with an optional starting index specified as above (defaults to 1).
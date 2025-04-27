# per-each (🍑) [WIP]

*per-each* is a custom enhancement, based on the be-enhanced family of behiviors, that 

1.  Provides for looping support, 
2.  Imposes little to no requirements as far as binding syntax.
3.  Promotes use of custom elements for encapsulating logic and binding as needed, while
4.  Working around limitations of proper HTML decorum.

Example:  Suppose we want to display the medal count and details of the last Olympics, using the HTML table element.

This could look as follows:

```html
<script>
    customElements.define('national-medal-list', class {
        static config = {
            xform:{
                "-o totalMedalCount": 0
            }
        }
        #ishList = [
            {rank: 1, noc: 'United States', gold: 40, silver: 44, bronze: 42, total: 126},
            {rank: 2, noc: 'China', gold: 40, silver: 27, bronze: 24, total: 91},
            {rank: 3, noc: 'Japan', gold: 20, silver: 27, bronze: 13, total: 45},
            ...
        ];
 
        get ishList(){
            return this.#ishList;
        }
        set ishList(nv){
            //we could filter the list if applicable first
            this.#ishList = nv;
            this.#calculateTotal();
            this.dispatchEvent(new Event('ishListChanged'));
        }

        #calculateTotal(){
            if(this.#ishList.reducer((accumulator, currentValue) => accumulator + currentValue.total));
        }

        #totalMedalCount;
        get totalMedalCount(){
            return this.#totalMedalCount;
        }
        attachedCallback(enhancedEl){
        }
    });
    customElements.define('country-medal-count', class {
        //view model that gets passed in goes here by default
        #ish
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

        async attachedCallback(element){
            //binding / event handling added here
        }

        //do we need this?
        forget(fragmentChildren){
            //release event handlers as needed, especially if the element will remain for whatever reason
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

In this example, the *country-medal-count* custom element chooses to use microdata ("itemprop") for biding clues, but *per-each* doesn't really care about that, and doesn't look for any itemprop attributes (only itemscope).  It just needs a custom element that implements:

```JavaScript
interface IshFace{
    attachedCallback(el: Element): Promise<void>;
    ish: any;
}
```
... in the case of each iterating item, and

```JavaScript
interface IshListFace extends IshFace{
    ishList: any[];
}
```

... that emits event "ishListChanged" when a new list is to be applied, in the case of the DOM element that holds, and manipulates, and possibly retrieves the list.

## Libraries that help with developer ergonomics

What we've seen above is that there is a certain amount of ceremony required to define the custom elements that are needed for per-each to be able to work.  If *per-each* is used frequently, it is advisable to use a helper library to reduce the boilerplate necessary, and the demos in this package do use such a helper library, which builds on [trans-rendering](https://github.com/bahrus/trans-render/wiki/V.--Mount%E2%80%90observing-transforms).

## Getting xform from custom elements
Use lcXform prop

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
            per-each="country-medal-count of national-medal-list" per-each-modulo=3 -s=aria-rowindex>
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

Limitations -- can only work with adjacent elements as part of fragment


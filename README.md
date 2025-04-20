# per-each (🍑) [TODO]

*per-each* is a custom enhancement, based on the be-enhanced family of behiviors, that 

1.  Provides for looping support, 
2.  Imposes little to no requirements as far as binding.
3.  Promotes use of custom elements for encapsulating logic and binding as needed, while
4.  Working around limitations of proper HTML decorum.

Example:  Suppose we want to display the medal count and details of the last Olympics, using the HTML table element.

This could look as follows:

```html
<script>
    customElements.define('my-list', class {
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
        /**
         * @type {Element}
         */
        #enhancedElement;
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
            this.#enhancedElement = enhancedEl;
        }
    });
    customElements.define('my-item', class {
        static config: {
            xform: {
                "| rank": 0,
                "| noc": 0,
                "| gold": 0,
                "| silver": 0,
                "| total": 0,
            }
        }
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

        hydrate(fragmentChildren){
            //after done hydrating, raise event 'hydrated'
            ...
            this.dispatchEvent(new Event('hydrated'));
        }

        //do we need this?
        forget(fragmentChildren){
            //release event handlers as needed, especially if the element will remain for whatever reason
        }


    });

</script>
<table itemscope=my-list>
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
            per-each="my-item of my-list" -s=aria-rowindex>
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
</table>
```

In this example, the *my-item* custom element chooses to use trans-rendering as the binding mechanism, but *per-each* doesn't really care about that

## Getting xform from custom elements
Use lcXform prop

## Setting attributes from the index


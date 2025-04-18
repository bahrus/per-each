# per-each (🍑) [TODO]

*per-each* is a custom enhancement, based on the be-enhanced family of behiviors, that 

1.  Provides for looping support, 
2.  Encourages semantic HTML.
3.  Promotes use of custom elements for encapsulating logic as needed, while
4.  Working around limitations of proper HTML decorum.

Example:  Suppose we want to display the medal count and details of the last Olympics, using the HTML table element.

This could look as follows:

```html
<script>
    customElements.define('my-list', class {
        #isList = [
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
            return this.#isList;
        }
        set ishList(nv){
            this.#isList = nv;
            this.#calculateTotal();
            this.dispatchEvent(new Event('ishListChanged'));
        }

        #calculateTotal(){
            if(this.#isList.reducer((accumulator, currentValue) => accumulator + currentValue.total));
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
        <tr per-each='my-item of my-list do {
            "my-item": {
                "| rank": 0,
                "| noc": 0,
                "| gold": 0,
                "| silver": 0,
                "| total": 0,
            },
            "my-list": {
                "-o totalMedalCount": 0
            }
        }'>
            <td itemprop=rank></td>
            <td itemprop=noc></td>
            <td itemprop=gold></td>
            <td itemprop=silver></td>
            <td itemprop=bronze></td>
            <td itemprop=total><span itemprop=total></span> of <span -o=totalMedalCount></span></td>
        </tr>
</table>
```

...generates:

```html
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
        <tr itemscope=my-item>
            <td itemprop=rank>1</td>
            <td itemprop=noc>United States</td>
            <td itemprop=gold>40</td>
            <td itemprop=silver>44</td>
            <td itemprop=bronze>42</td>
            <td itemprop=total><span itemprop=total>126</span> of <span -o=totalMedalCount>1044</td>
        </tr>
        <tr itemscope=my-item>
            <td itemprop=rank>2</td>
            <td itemprop=noc>China</td>
            <td itemprop=gold>40</td>
            <td itemprop=silver>27</td>
            <td itemprop=bronze>24</td>
            <td itemprop=total><span itemprop=total>91</span> of <span -o=totalMedalCount>1044</td>
        </tr>
        <tr itemscope=my-item>
            <td itemprop=rank>3</td>
            <td itemprop=noc>Japan</td>
            <td itemprop=gold>20</td>
            <td itemprop=silver>27</td>
            <td itemprop=bronze>13</td>
            <td itemprop=total><span itemprop=total>45</span> of <span -o=totalMedalCount>1044</td>
        </tr>
        ...
    </tbody>
</table>
```

## Getting xform from custom elements
Use lcXform prop


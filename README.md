# per-each

*per-each* is a custom enhancement, based on the be-enhanced family of behiviors, that 

1.  Provides for looping support, 
2.  Encourages semantic HTML.
3.  Promotes use of custom elements for encapsulating logic as needed, while
4.  Working around limitations of proper HTML decorum.

Example:  Suppose we want to display of the medal count and details of the last Olympics, using the HTML table element.

This would look as follows:

```html
<script>
    customElements.define('my-list', class {
        #isList = ["hello", "world"];
        /**
         * @type {Element}
         */
        #enhancedElement;
        get ishList(){
            return this.#isList;
        }
        set ishList(nv){
            this.#isList = nv;
            this.#enhancedElement.dispatchEvent(new Event('ishListChanged'));
        }
        attachedCallback(enhancedEl){
            this.#enhancedElement = enhancedEl;
        }
    });
</script>
<ul itemscope=my-list>
    <li>Head Item</li>
    <li per-each="my-item in my-list"></li>
    <li>Footer</li>
</ul>
```
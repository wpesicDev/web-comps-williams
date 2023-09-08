import { Shadow } from "../../prototypes/Shadow";


export default class typingAni extends Shadow() {
    constructor(options = {}, ...args) {
        super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options }, ...args);
        
    }

    connectedCallback() {

        if (this.shouldRenderCSS()) this.renderCSS();
        if (this.shouldRenderHTML()) this.renderHTML();
 
    }
    disconnectedCallback() {

    }

    shouldRenderCSS() {
        return !this.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`);
    }

    shouldRenderHTML() {
        return !this.querySelector('.container');
    }

    renderCSS() {

    }

    renderHTML() {
        this.html = /* HTML */ `
        <div class = "container">

        
        
        </div>


        `

    }



}

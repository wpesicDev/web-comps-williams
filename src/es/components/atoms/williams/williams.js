// @ts-check
import { Hover } from '../../prototypes/Hover.js'



export default class williamshero extends Hover() {
  connectedCallback () {
    super.connectedCallback()
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.html
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */`

      :host {
        display: flex;
        vertical-align: center;
      }
      .container {
        position: relative;
        width: 100%;
        padding: 5%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
      }
      .text, p , Button{
        position: relative;
        color: white; 
        
        
      }
      .imagebackground {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-image: url('../src/img/williamshero/1055201.jpg');
        background-position: bottom;        
        background-size: cover;
        background-attachment: fixed;

      }
      .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
      }
      .Buttons-Section{
        display: flex;
        justify-content: space-between;
        width: 20%;
        height: 30px

      }
      Button{
        width: 45%;
        height: 100%;


      }
    
      .B-2{
        background: transparent;
        color:white;
        border:1px solid white;
        
      }
      .B-2:hover{
        background: black;
        color:white;
        border:1px solid black;
        
      }
      .B-1{
        background: rgb(185, 3, 52);
        border: 3px solid rgb(185, 3, 52);
      }
      .B-1:hover{
        background: rgb(133, 2, 37);
        border: 3px solid rgb(133, 2, 37);
      }
    `;
}

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = /* html */`
    <div class="container">
        <div class="imagebackground"></div>
        <div class="overlay"></div> 
        <div class="Ctext">
          <h1 class="text">Welcome to WilliamsFusion</h1>
          <p>WillamsFusion heißt Sie herzlich willkommen. Als vertrauenswürdiger Partner bieten wir Ihnen eine breite Palette von maßgeschneiderten IT-Lösungen und unterstützen Sie bei der erfolgreichen Umsetzung Ihrer digitalen Transformationsstrategien.</p>
          <div class="Buttons-Section">
            <Button class="B-1">About us</Button>
            <Button class ="B-2">Contact now</button>
          </div>
        </div>
    </div>
    `;
}


}

import { Shadow } from '../../prototypes/Shadow.js';

export default class sideimg extends Shadow() {

  constructor (options = {}, ...args) {
    // @ts-ignore
    super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS();
    if (this.shouldRenderHTML()) this.renderHTML();
    this.clickEventListener();
    const buttons = this.root.querySelectorAll("button");
    console.log("Number of buttons found:", buttons.length);
    // Achtung der Eventlistener muss auf die Buttons gesetzt werden ansonsten wird er auf dem ganzen Component getriggert
    buttons.forEach(button => {
      button.addEventListener("click", event => this.clickEventListener(event));
    });


    // this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback(){
    this.removeEventListener('click', this.clickEventListener)
  }

  shouldRenderCSS() {
    return !this.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`);
  }

  shouldRenderHTML() {
    return !this.querySelector('.container');
  }

  renderCSS() {
    this.css = /* css */ `
    :host {
      display: flex;
      align-items: center;
    }
    .sideimg-container {
      padding: 5%;
      background-color: rgb(255, 255, 255);
      height: 70vh;
      width: 100%;
      border-radius: 10px;
      display: flex;
    }
    .one-sideimg-container {
      display: flex;
    }
    .two-sideimg-container {
      overflow: hidden;
      transition: transform 0.3s ease;  
      display: flex; 
    }
    .two-sideimg-container:hover {
      transform: translateY(-5px); 
    }
    .Button-Section{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      
    }

    Button{
      height: 100%;
      width: 10%;
      background: rgb(185, 3, 52);
      border: 3px solid rgb(185, 3, 52);
      color:white;
    
    
    }
    
    
    Button:hover{
      background: rgb(133, 2, 37);
      border: 3px solid rgb(133, 2, 37);
    }
    
    `;
  }

  renderHTML() {
    this.html = /* html */ `

    
    `;
  
  }
// Button selber nioch hinzufügen ansonsten ist das ein bug noch da sie auf dem Ganzen komonenten reloaded und nicht nur auf den button selbst evt doch 2 Switch Cases???
  clickEventListener = event => {
    var imageChange = this.root.querySelector(".sideimg-image");

    console.log("buttonListener", event?.composedPath());
    const button = event?.composedPath()[0];
    const action = button?.getAttribute("namespace") || this.getAttribute('namespace')
  
    switch (action) { 
      case 'side-img-imgright-':
        console.log('case imgright');
        imageChange.src = `${this.importMetaUrl}./sideimg/WorkingIMGworking.png`;
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./imgright-/imgright-.css`,
          }
        ]);
        break;
      case 'side-img-imgleft-':
        console.log('case imgleft');
        imageChange.src = `${this.importMetaUrl}./sideimg/Workingimgleft.png`;
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./imgleft-/imgleft-.css`,            
          }
        ]);
        break;
      case 'side-img-imgup-':
        console.log('case imgup');
        imageChange.src = `${this.importMetaUrl}./sideimg/workingimgdown.png`;
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./imgup-/imgup-.css`,            
          }
        ]);
        break;
      case 'side-img-imgdown-':
        console.log('case imgdown');
        imageChange.src = `${this.importMetaUrl}./sideimg/workingimgup.png`;
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./imgdown-/imgdown-.css`,            
          }
        ]);
        break;
        default:
          console.log("default value")
          imageChange.src = `${this.importMetaUrl}./sideimg/WorkingIMGworking.png`;
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./imgright-/imgright-.css`,
            }
          ]);
    }
  }
}

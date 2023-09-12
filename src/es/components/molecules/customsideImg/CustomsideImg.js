import { Shadow } from '../../prototypes/Shadow.js'

export default class CustomsideImg extends Shadow() {

  constructor (options = {}, ...args) {
    // @ts-ignore
    super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS();
    if (this.shouldRenderHTML()) this.renderHTML();
    this.clickEventListener();
    this.addEventListener("click", this.clickEventListener);
  }

  disconnectedCallback(){
    this.removeEventListener("click", this.clickEventListener);
    console.log('disconnect');
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
  //bugfix durch implementierung von Button eventlistener der alte hatte die Events immer auf den ganzen Komponenten abgehört
  clickEventListener = event => {
    console.log('event', event?.composedPath());
    var imageChange = this.root.querySelector(".sideimg-image");

    console.log("buttonListener", event?.composedPath());
    const button = event?.composedPath().find(button => button?.hasAttribute?.('data'));
    const action = button?.getAttribute("data") || this.getAttribute('data');

    if (this.defaultSource){
      imageChange.src = this.defaultSource;
      switch (action) { 
        case 'customside-img-customimgright-':
          console.log('case imgright');
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgright-/customimgright-.css`,
            }
          ]);
          break;
        case 'customside-img-customimgleft-':
          console.log('case imgleft');
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgleft-/customimgleft-.css`,            
            }
          ]);
          break;
        case 'customside-img-customimgup-':
          console.log('case imgup');
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgup-/customimgup-.css`,            
            }
          ]);
          break;
        case 'customside-img-customimgdown-':
          console.log('case imgdown');
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgdown-/customimgdown-.css`,            
            }
          ]);
          break;
          default:
            console.log("default value")
            this.fetchCSS([
              {
                path: `${this.importMetaUrl}./customimgright-/customimgright-.css`,
              }
            ]);
      }


    }else{
      switch (action) { 
        case 'side-Img-customimgright-':
          console.log('case imgright');
          imageChange.src = `${this.importMetaUrl}./sideimg/WorkingIMGworking.png`;
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgright-/customimgright-.css`,
            }
          ]);
          break;
        case 'side-Img-customimgleft-':
          console.log('case imgleft');
          imageChange.src = `${this.importMetaUrl}./sideimg/Workingimgleft.png`;
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgleft-/customimgleft-.css`,            
            }
          ]);
          break;
        case 'side-Img-customimgup-':
          console.log('case imgup');
          imageChange.src = `${this.importMetaUrl}./sideimg/workingimgdown.png`;
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgup-/customimgup-.css`,            
            }
          ]);
          break;
        case 'side-Img-customimgdown-':
          console.log('case imgdown');
          imageChange.src = `${this.importMetaUrl}./sideimg/workingimgup.png`;
          this.fetchCSS([
            {
              path: `${this.importMetaUrl}./customimgdown-/customimgdown-.css`,            
            }
          ]);
          break;
          default:
            console.log("default value")
            imageChange.src = `${this.importMetaUrl}./sideimg/WorkingIMGworking.png`;
            this.fetchCSS([
              {
                path: `${this.importMetaUrl}./customimgright-/customimgright-.css`,
              }
            ]);
      }

    }

  }

    get defaultSource() {
      if (this.getAttribute("defaultSource")) {
          return this.getAttribute("defaultSource");
      } else {
          return "";
      }
  }


}

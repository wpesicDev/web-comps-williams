import { Shadow } from '../../prototypes/Shadow.js';

export default class UploadsideImg extends Shadow() {
  constructor(options = {}, ...args) {
    super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options }, ...args);

    this.recentURL = localStorage.getItem("letztes-bild") || "";
    
  }

  connectedCallback() {
    const scrollPositionJson = localStorage.getItem('scrollPosition');

    if (scrollPositionJson) {
      const scrollPosition = JSON.parse(scrollPositionJson);
      window.scrollTo(scrollPosition.x, scrollPosition.y);
    }

    if (this.shouldRenderCSS()) this.renderCSS();
    if (this.shouldRenderHTML()) this.renderHTML();
    this.clickEventListener();

    this.initImage();


    const buttons = this.root.querySelectorAll("button");
    console.log("Number of buttons found:", buttons.length);
    
    // Achtung der Eventlistener muss auf die Buttons gesetzt werden, ansonsten wird er auf dem ganzen Component getriggert
    buttons.forEach(button => {
      button.addEventListener("click", event => this.clickEventListener(event));
    });

    window.addEventListener('scroll', () =>{
      const scrollPosition = {
        x: window.scrollX,
        y: window.scrollY
      }

      localStorage.setItem('scrollPosition', JSON.stringify(scrollPosition));
    })
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.clickEventListener);
    this.removeEventListener()
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
    .Button-Section {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
    }

    Button {
      height: 100%;
      width: 10%;
      background: rgb(185, 3, 52);
      border: 3px solid rgb(185, 3, 52);
      color: white;
    }

    Button:hover {
      background: rgb(133, 2, 37);
      border: 3px solid rgb(133, 2, 37);
    }

    .container{
      display: flex;
      justify-content: center; 
      align-items: center;
    }
    `;
  }

  renderHTML() {
    this.html = /* html */ `
    <div class="container">

      <img class="sideimg-image" src="${this.setImageURL}" alt="Bild">
    </div>
    `;
  }

  clickEventListener = event => {
    const Fileinput = this.root.querySelectorAll("input");
    console.log("Number of input fields found:", Fileinput.length);
    console.log("Click Listened");
    console.log("buttonListener", event?.composedPath());
    const button = event?.composedPath()[0];
    const action = button?.getAttribute("namespace") || this.getAttribute('namespace');

    switch (action) {
      case 'uploadside-Img-uploadimgright-':
        console.log('case imgright');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./uploadimgright-/uploadimgright-.css`,
          }
        ]);
        break;
      case 'uploadside-Img-uploadimgleft-':
        console.log('case imgleft');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./uploadimgleft-/uploadimgleft-.css`,
          }
        ]);
        break;
      case 'uploadside-Img-uploadimgup-':
        console.log('case imgup');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./uploadimgup-/uploadimgup-.css`,
          }
        ]);
        break;
      case 'uploadside-Img-uploadimgdown-':
        console.log('case imgdown');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./uploadimgdown-/uploadimgdown-.css`,
          }
        ]);
        break;
      default:
        console.log("default value")
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./uploadimgright-/uploadimgright-.css`,
          }
        ]);
    }

    Fileinput.forEach(input => {
      input.addEventListener("change", async () => {
        const reader = new FileReader();
        reader.addEventListener("load", async () => {
          await localStorage.setItem("letztes-bild", reader.result);

          this.recentURL = localStorage.getItem("letztes-bild") || ""
          this.initImage();

          //location.reload();

        });
      });
    });
  }

  initImage() {
    // um das ganze immer zu reinitialisieren habe eine funktion gemacht die das ganze redefiniert.
    const imageChange = this.root.querySelector(".sideimg-image");
    imageChange.src = this.setImageURL;
  }

  get defaultSource() {
    if (this.getAttribute("defaultSource")) {
      return this.getAttribute("defaultSource");
    } else {
      return "";
    }
  }

  get setImageURL() {
    if (this.recentURL) {
      console.log("Recent localStorage URL")
      return this.recentURL;
    } else {

      console.log("DefaultSource")
      return this.defaultSource;
    }
  }
}

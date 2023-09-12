import { Shadow } from '../../prototypes/Shadow.js';

export default class showimg extends Shadow() {
  constructor(options = {}, ...args) {
    super({ hoverInit: undefined, importMetaUrl: import.meta.url, ...options }, ...args);



    this.recentURL = localStorage.getItem("letztes-bild") || "";

    // this.imageArray = JSON.parse(localStorage.getItem('srcArray')) || [];

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

    window.addEventListener('scroll', () => {
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

    .showimg-container{
      display: flex;
      flex-direction: column;
      max-width: 100%;
      width: auto;
      max-height: 100%;
      height: auto;
    }
    `;
  }

  renderHTML() {
    this.html = /* html */ `


    <div class="showimg-container">

      <img class="showimg" src="" />
 
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
      case 'show-Img-showimgright-':
        console.log('case imgright');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./showimgright-/showimgright-.css`,
          }
        ]);
        break;
      case 'show-Img-showimgleft-':
        console.log('case imgleft');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./showimgleft-/showimgleft-.css`,
          }

        ]);
        break;
      case 'show-Img-showimgup-':
        console.log('case imgup');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./showimgup-/showimgup-.css`,
          }
        ]);
        break;
      case 'show-Img-showimgdown-':
        console.log('case imgdown');
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./showimgdown-/showimgdown-.css`,
          }
        ]);
        break;
      default:
        console.log("default value")
        this.fetchCSS([
          {
            path: `${this.importMetaUrl}./showimgright-/showimgright-.css`,
          }
        ]);
    }

    Fileinput.forEach(input => {
      input.addEventListener("change", async () => {
        const reader = new FileReader();

        reader.addEventListener("load", async () => {

          await localStorage.setItem("letztes-bild", reader.result);

          try {
            this.imageArray.push(reader.result);
            console.log(this.imageArray);

            localStorage.setItem("srcArray", JSON.stringify(this.imageArray || null));

            this.initImage();
            location.reload();
          } catch (e) {
            console.error("cannot get from localstorage", e);
          }
        });

        reader.readAsDataURL(input.files[0]);
      });
    });
  }


  initImage() {
    // um das ganze immer zu reinitialisieren habe eine funktion gemacht die das ganze redefiniert.
    const imageChange = this.root.querySelector("a-picture");
    imageChange.defaultSource = this.setImageURL;

  }

  get defaultSource() {
    if (this.getAttribute("defaultSource")) {
      return this.root.querySelector("a-picture").getAttribute("defaultSource");
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

// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/* global Arrow */
/* global customElements */
/* global self */

/**
 * https://css-tricks.com/how-to-make-a-css-only-carousel/
 * TODO: slides-per-view
 *
 * @attribute {
 * }
 * @css {
 * }
 * @type {CustomElementConstructor}
 */
export default class CarouselTwo extends Shadow() {
  constructor (...args) {
    super(...args)

    // on click anchor scroll to the image with the matching id or previous/next
    this.clickListener = event => {
      let target
      if ((target = event.composedPath().find(node => typeof node.getAttribute === 'function' && node.getAttribute('href')))) {
        let sectionChild
        if ((sectionChild = this.section.querySelector(target.getAttribute('href')))) {
          this.scrollIntoView(sectionChild)
        } else if (target.getAttribute('href') === '#previous') {
          this.previous()
        } else if (target.getAttribute('href') === '#next') {
          this.next()
        }
      }
    }
    // on focus scroll to the right element
    this.focusListener = event => {
      let target
      if ((target = event.target) && Array.from(this.section.children).includes(target)) this.scrollIntoView(target, false)
    }
    // on scroll calculate which image is shown and set its and all of its referencing href nodes the class to active
    let scrollTimeoutId = null
    const scrollTolerance = 5
    this.scrollListener = event => {
      this.section.classList.add('scrolling')
      clearTimeout(scrollTimeoutId)
      scrollTimeoutId = setTimeout(() => {
        let hostLeft, activeChild
        if ((hostLeft = Math.round(this.getBoundingClientRect().left)) && (activeChild = Array.from(this.section.children).find(node => {
          const nodeLeft = Math.round(node.getBoundingClientRect().left)
          return hostLeft + scrollTolerance > nodeLeft && hostLeft - scrollTolerance < nodeLeft
        }))) {
          Array.from(this.root.querySelectorAll('.active')).forEach(node => {
            node.classList.remove('active')
            node.setAttribute('aria-hidden', 'true')
          })
          activeChild.classList.add('active')
          activeChild.setAttribute('aria-hidden', 'false')
          Array.from(this.root.querySelectorAll(`[href="#${activeChild.getAttribute('id')}"]`)).forEach(node => {
            if (Array.from(this.nav.children).includes(node.parentNode)) node.parentNode.classList.add('active')
            node.classList.add('active')
          })
          this.section.classList.remove('scrolling')
        }
      }, 50)
    }
    // interval stuff
    this.interval = null
    // stop interval when clicking outside window eg. iframe, etc.
    this.blurEventListener = event => this.setInterval()
    this.focusEventListener = event => this.clearInterval()
  }

  connectedCallback () {
    const showPromises = []
    if (this.shouldComponentRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldComponentRenderHTML()) showPromises.push(this.renderHTML())
    Array.from(this.section.children).concat(Array.from(this.nav.children)).forEach(node => {
      const picture = node.tagName === 'A-PICTURE'
        ? node
        : node.querySelector('a-picture')
      if (picture && picture.hasAttribute('picture-load') && !picture.hasAttribute('loaded')) showPromises.push(new Promise(resolve => picture.addEventListener('picture-load', event => resolve(), { once: true })))
    })
    // Carousel still pops instead of appear nicely. With slow network connection it works though.
    if (showPromises.length) {
      this.hidden = true
      Promise.all(showPromises).then(() => {
        this.hidden = false
        this.scrollIntoView(this.section.children[this.hasAttribute('active') ? Number(this.getAttribute('active')) : 0], false)
        if (this.getAttribute('interval')) this.setInterval()
      })
    }
    this.addEventListener('click', this.clickListener)
    this.section.addEventListener('scroll', this.scrollListener)
    Array.from(this.section.children).forEach(node => node.addEventListener('focus', this.focusListener))
    if (this.getAttribute('interval')) {
      this.addEventListener('blur', this.blurEventListener)
      this.addEventListener('focus', this.focusEventListener)
    }
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickListener)
    this.section.removeEventListener('scroll', this.scrollListener)
    Array.from(this.section.children).forEach(node => node.removeEventListener('focus', this.focusListener))
    if (this.getAttribute('interval')) {
      this.removeEventListener('blur', this.blurEventListener)
      this.removeEventListener('focus', this.focusEventListener)
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return !this.section || !this.nav || !this.arrowNav
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        background-color: var(--background-color, transparent);
        display: grid !important;
      }
      :host > section, :host > nav, :host > *.arrow-nav {
        grid-column: 1;
        grid-row: 1;
      }
      :host > section {
        display: flex;
        overflow: hidden;
        scroll-behavior: smooth;
        scroll-snap-type: x mandatory;
      }
      :host > section > * {
        align-items: var(--section-child-align-items, center);
        display: flex;
        flex-direction: column;
        justify-content: var(--section-child-justify-content, center);;
        min-width: 100%;
        outline: none;
        scroll-snap-align: start;
      }
      :host > section:not(.scrolling) > *:not(.active) {
        opacity: 0;
      }
      :host > nav {
        align-items: center;
        align-self: ${this.hasAttribute('nav-align-self')
          ? this.getAttribute('nav-align-self')
          : 'var(--nav-align-self, end)'};
        display: flex;
        gap: var(--nav-gap);
        height: fit-content;
        margin: var(--nav-margin);
        max-height: 20%;
        justify-content: center;
        z-index: 101;
      }
      :host > nav > * {
        --a-margin: 0;
        padding: 0;
        margin: 0;
      }
      :host(.has-default-nav) > nav > * {
        background-color: var(--nav-background-color, pink);
        border-radius: var(--nav-border-radius, 50%);
        height: var(--nav-height, 1em);
        width: var(--nav-width, 1em);
        opacity: var(--nav-opacity, 0.5);
      }
      :host(.has-default-nav) > nav > *, :host > nav > * {
        transition: all .3s ease-out !important;
      }
      :host(.has-default-nav) > section:not(.scrolling) ~ nav > *.active {
        background-color: var(--nav-background-color-active, coral);
        opacity: var(--arrow-nav-opacity-active, 1);
      }
      :host(.has-default-nav) > section:not(.scrolling) ~ nav > *.active, :host > section:not(.scrolling) ~ nav > *.active {
        transform: var(--nav-transform-active, scale(1.3));
      }
      :host(.has-default-nav) > section.scrolling ~ nav > *:hover, :host(.has-default-nav) > section:not(.scrolling) ~ nav > *:hover {
        background-color: var(--nav-background-color-hover, white);
        opacity: var(--arrow-nav-opacity-hover, var(--arrow-nav-opacity-active, 1));
      }
      :host(.has-default-nav) > section.scrolling ~ nav > *:hover, :host(.has-default-nav) > section:not(.scrolling) ~ nav > *:hover, :host > section.scrolling ~ nav > *:hover, :host > section:not(.scrolling) ~ nav > *:hover {
        transform: var(--nav-transform-hover, scale(1.6));
      }
      :host(.has-default-arrow-nav) > *.arrow-nav {
        align-items: center;
        display: flex;
        margin: 0;
        justify-content: space-between;
        z-index: 100;
        font-size: 5em;
      }
      :host(.has-default-arrow-nav) > *.arrow-nav > * {
        align-items: center;
        display: flex;
        margin: var(--arrow-nav-margin, 0);
        justify-content: center;
        height: 100%;
        width: 50%;
        opacity: var(--arrow-nav-opacity, 0.5);
        transition: all .3s ease-out;
      }
      :host(.has-default-arrow-nav) > *.arrow-nav > *:hover {
        opacity: var(--arrow-nav-opacity-hover, 1);
      }
      :host(.has-default-arrow-nav) > *.arrow-nav > *:first-of-type {
        justify-content: start;
      }
      :host(.has-default-arrow-nav) > *.arrow-nav > *:last-of-type {
        justify-content: end;
      }
      @media only screen and (max-width: _max-width_) {
        :host > section {
          overflow-x: scroll;
        }
        :host > nav {
          gap: var(--nav-gap-mobile, var(--nav-gap));
          margin: var(--nav-margin-mobile, var(--nav-margin));
        }
        :host > *.arrow-nav, :host(.has-default-arrow-nav) > *.arrow-nav {
          display: none;
        }
      }
    `
    // attribute controlled styles
    const setAttributeStyles = () => {
      if (this.hasAttribute('background-color')) {
        this.setCss(/* css */`
        :host {
          background-color: ${this.getAttribute('background-color')};
        }
      `, undefined, false)
      }
      if (this.hasAttribute('nav-background-color')) {
        this.setCss(/* css */`
        :host(.has-default-nav) > nav > * {
          background-color: ${this.getAttribute('nav-background-color')};
        }
      `, undefined, false)
      }
      if (this.hasAttribute('nav-background-color-active')) {
        this.setCss(/* css */`
        :host(.has-default-nav) > section:not(.scrolling) ~ nav > *.active {
          background-color: ${this.getAttribute('nav-background-color-active')};
        }
      `, undefined, false)
      }
      if (this.hasAttribute('nav-background-color-hover')) {
        this.setCss(/* css */`
        :host(.has-default-nav) > section.scrolling ~ nav > *:hover, :host(.has-default-nav) > section:not(.scrolling) ~ nav > *:hover {
          background-color: ${this.getAttribute('nav-background-color-hover')}
        }
      `, undefined, false)
      }
      if (this.hasAttribute('arrow-nav-color')) {
        this.setCss(/* css */`
        :host > *.arrow-nav > * {
          --color: ${this.getAttribute('arrow-nav-color')}
        }
      `)
      }
      if (this.hasAttribute('arrow-nav-color-hover')) {
        this.setCss(/* css */`
        :host > *.arrow-nav > *:hover {
          --color: ${this.getAttribute('arrow-nav-color-hover')}
        }
      `)
      }
    }
    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'carousel-two-default-':
        return this.fetchCSS([{
          path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false).then(() => setAttributeStyles())
      default:
        return this.fetchCSS(styles, false).then(() => setAttributeStyles())
    }
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderHTML () {
    this.section = this.root.querySelector('section') || document.createElement('section')
    this.nav = this.root.querySelector('nav') || document.createElement('nav')
    this.arrowNav = this.root.querySelector('.arrow-nav') || document.createElement('span')
    this.arrowNav.classList.add('arrow-nav')
    return this.loadChildComponents().then(children => {
      // check item correlation between slides and navigation
      if (this.section.children.length !== this.nav.children.length || this.classList.contains('has-default-nav')) {
        this.classList.add('has-default-nav')
        // clear nav on discrepancy
        if (this.nav.childNodes.length) {
          console.warn('CarouselTwo.js has just cleared your incomplete navigation. Make sure that the nav container (navChildNodes) contains a link for each slide (sectionChildren).', { navChildNodes: this.nav.cloneNode(true).childNodes, sectionChildren: this.section.children, carousel: this })
          this.nav.innerHTML = ''
        }
        // generate default nav
        Array.from(this.section.children).forEach(node => {
          const a = document.createElement('a')
          this.nav.appendChild(a)
        })
      }
      // generate default arrows
      if (this.arrowNav.children.length < 2 || this.classList.contains('has-default-arrow-nav')) {
        this.classList.add('has-default-arrow-nav')
        // clear arrowNav on discrepancy
        if (this.arrowNav.childNodes.length) {
          console.warn('CarouselTwo.js has just cleared your incomplete arrow navigation. Make sure that the arrow nav container (arrowNavChildNodes) contains at least two children.', { arrowNavChildNodes: this.arrowNav.cloneNode(true).childNodes, carousel: this })
          this.arrowNav.innerHTML = ''
        }
        for (let i = 0; i < 2; i++) {
          const a = document.createElement('a')
          a.setAttribute('href', i === 0 ? '#previous' : '#next')
          const arrow = new children[0][1]({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback') })
          arrow.setAttribute('direction', i === 0 ? 'left' : 'right')
          a.appendChild(arrow)
          this.arrowNav.appendChild(a)
        }
      }
      Array.from(this.section.children).forEach((node, i) => {
        // add attribute tabindex to each slide
        node.setAttribute('tabindex', '0')
        // make sure the ids match between section and navigation nodes
        const id = `${this.id}-${i}`
        node.setAttribute('id', id)
        node.setAttribute('aria-hidden', 'true')
        // set the id on the nav child
        if (this.nav.children[i]) {
          let navNode = this.nav.children[i].tagName === 'A'
            ? this.nav.children[i]
            : this.nav.children[i].querySelector('a')
              ? this.nav.children[i].querySelector('a')
              : null
          if (!navNode) {
            navNode = document.createElement('a')
            const navNodeChild = this.nav.children[i]
            navNodeChild.replaceWith(navNode)
            navNode.appendChild(navNodeChild)
          }
          navNode.setAttribute('href', `#${id}`)
        } else {
          console.warn('CarouselTwo.js expected a nav node (navChildNode) corresponding with the slide (sectionChildNode).', { navChildNode: this.nav.children[i], sectionChildNode: node, carousel: this })
        }
      })
      this.html = [this.section, this.nav, this.arrowNav]
    })
  }

  previous (focus) {
    return this.scrollIntoView((this.activeSlide && this.activeSlide.previousElementSibling) || Array.from(this.section.children)[this.section.children.length - 1], focus)
  }

  next (focus) {
    return this.scrollIntoView((this.activeSlide && this.activeSlide.nextElementSibling) || Array.from(this.section.children)[0], focus)
  }

  scrollIntoView (node, focus = true) {
    if (!node.classList.contains('active')) {
      if (focus) return node.focus() // important that default keyboard works
      //node.scrollIntoView() // scrolls x and y
      this.section.scrollTo({
        left: this.section.scrollLeft + node.getBoundingClientRect().x - this.section.getBoundingClientRect().x,
        behavior: 'smooth'
      })
      this.scrollListener()
    }
    return node
  }

  setInterval () {
    clearInterval(this.interval)
    this.interval = setInterval(() => this.next(false), Number(this.getAttribute('interval')))
  }

  clearInterval () {
    clearInterval(this.interval)
  }

  /**
   * fetch children when first needed
   *
   * @param {Promise<[string, CustomElementConstructor]>[]} [promises=[]]
   * @returns {Promise<[string, CustomElementConstructor][]>}
   */
  loadChildComponents (promises = []) {
    if (this.childComponentsPromise) return this.childComponentsPromise
    let arrowPromise
    try {
      arrowPromise = Promise.resolve({ default: Arrow })
    } catch (error) {
      arrowPromise = import('../../atoms/arrow/Arrow.js')
    }
    return (this.childComponentsPromise = Promise.all([
      arrowPromise.then(
        /** @returns {[string, CustomElementConstructor]} */
        module => ['a-arrow', module.default]
      ),
      ...promises
    ]).then(elements => {
      elements.forEach(element => {
        // don't define already existing customElements
        // @ts-ignore
        if (!customElements.get(element[0])) customElements.define(...element)
      })
      return elements
    }))
  }

  getRandomString () {
    if (self.crypto && self.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
      const a = self.crypto.getRandomValues(new Uint32Array(3))
      let token = ''
      for (let i = 0, l = a.length; i < l; i++) {
        token += a[i].toString(36)
      }
      return token
    } else {
      return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '')
    }
  }

  get activeSlide () {
    return this.section.querySelector('.active')
  }

  get id () {
    return this._id
      ? this._id
      : this.getAttribute('id')
        ? (this._id = this.getAttribute('id'))
        : (this._id = `img-${this.getRandomString()}`)
  }
}
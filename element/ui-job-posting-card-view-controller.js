'use strict'
const uiJobPostingCardDoc = document._currentScript || document.currentScript;
const uiJobPostingCardView = uiJobPostingCardDoc.ownerDocument.querySelector('#ui-job-posting-card-view');

class JobPostingCardViewController extends HTMLElement{

	static get observedAttributes(){
		return [];
	}

  constructor(){
    super();
    const view = uiJobPostingCardView.content.cloneNode(true);
		this.shadowRoot = this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(view);
		//set variables
		this.dataController = new JobPosting();
    this.expanded = false;
    this.listening = false;
  }

		///STANDARD
	connectedCallback() {
		//console.log('connected');
    this.card = this.shadowRoot.querySelector('#card')
    this.container = this.shadowRoot.querySelector('#container');
    this.summaryContainer = this.shadowRoot.querySelector('#summaryContainer');
    this.actionsContainer = this.shadowRoot.querySelector('#actionsContainer');
    this.viewPostButton = this.shadowRoot.querySelector('#viewPost');
    this.hiringOrganization = this.shadowRoot.querySelector('#hiringOrganization')
    this.test = this.shadowRoot.querySelector('#test');

		//TEMP
    let loop = setInterval(e=>{
      if(this.expanded) {
        this.card.removeEventListener('click', this.expandPreview)
        this.container.removeEventListener('click', this.expandPreview)
        this.summaryContainer.removeEventListener('click', this.expandPreview)
        this.listening = false;
      }
      if(this.isInViewPort() === false){
        this.card.removeEventListener('click', this.expandPreview)
        this.container.removeEventListener('click', this.expandPreview)
        this.summaryContainer.removeEventListener('click', this.expandPreview)
        this.listening = false;
      }
      if(this.isInViewPort() && this.expanded === false && this.listening === false){
        this.card.addEventListener('click', e => { this.expandPreview(e) })
        this.container.addEventListener('click', e => { this.expandPreview(e) })
        this.summaryContainer.addEventListener('click', e => { this.expandPreview(e) })
        this.listening = true;
      }
    }, 500)
	}

	disconnectedCallback() {
		//console.log('disconnected');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		//console.log('attributeChanged');
	}

	adoptedCallback(){
		//console.log('adoptedCallback');
	}

	get shadowRoot(){ return this._shadowRoot; }
	set shadowRoot(value){ this._shadowRoot = value;}


  expandPreview(e){
		this.expanded = true;
    this.card.style.maxHeight = "999px";
    this.card.style.backgroundColor = "white";
    //this.card.style.backgroundColor = "#eff3f7";
    //this.card.style.borderColor ="#37a0e1";
    //this.card.style.borderColor ="#e78880";
    this.centerVerticallyOnScreen();
    this.hiringOrganization.style.color = "#7f807f";

    let initOpacity = 0;
    let displaySummary = (timestamp) => {
      initOpacity = initOpacity + 0.1;
      this.summaryContainer.style.opacity = `${initOpacity}`
      this.actionsContainer.style.opacity = `${initOpacity}`
      if(initOpacity < 1){
        window.requestAnimationFrame(displaySummary)
      }
    }
    window.requestAnimationFrame(displaySummary)
    this.summaryContainer.style.height = "auto";
    this.actionsContainer.style.height = "auto";
    this.summaryContainer.style.display = "flex";
    this.actionsContainer.style.display = "flex";
  }

  centerVerticallyOnScreen(){
    const elementRect = this.card.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    let targetY = absoluteElementTop - (window.innerHeight / 4);
    targetY = parseInt(targetY)

    let steps = Math.abs(targetY - window.pageYOffset)/100;
    let current = 0;
    function scroll(timestamp){
      let minRange = targetY - 50;
      if(window.pageYOffset < minRange && current <= window.pageYOffset) {
        let next = window.pageYOffset + steps;
        current = next;
        window.scrollTo(0, next);
        window.requestAnimationFrame(scroll);
      }
    }
    window.requestAnimationFrame(scroll);
  }

  isInViewPort(){
		let el = this;
		var rect = el.getBoundingClientRect();
    let cardHeight = 80;
    let top = rect.top >= 0;
    let left = rect.left >=0;
    let bottom = rect.bottom <= (window.innerHeight + cardHeight || document.documentElement.clientHeight)
    let right = rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		return top && left && bottom && right;
	}
}

window.customElements.define('ui-job-posting-card', JobPostingCardViewController);

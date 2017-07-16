'use strict'
let currentDocument = document.currentScript.ownerDocument;

class JobPostingCardViewController extends HTMLElement{

  constructor(){
    super();
    const view = currentDocument.querySelector('#view').content.cloneNode(true);
    this.appendChild(view);

    this.dataController = new JobPosting();
    this.card = this.querySelector('#card')
    this.container = this.querySelector('#container');
    this.summaryContainer = this.querySelector('#summaryContainer');
    this.actionsContainer = this.querySelector('#actionsContainer');
    this.viewPostButton = this.querySelector('#viewPost');
    this.expanded = false;

    this.test = this.querySelector('#test');

    //TEMP
    let loop = setInterval(e=>{
      if(this.expanded) {
        this.card.removeEventListener('click', this.expandPreview)
        this.container.removeEventListener('click', this.expandPreview)
        this.summaryContainer.removeEventListener('click', this.expandPreview)
      }
      if(this.isInViewPort() === false){
        this.card.removeEventListener('click', this.expandPreview)
        this.container.removeEventListener('click', this.expandPreview)
        this.summaryContainer.removeEventListener('click', this.expandPreview)
      }
      if(this.isInViewPort() && this.expanded === false){
        this.card.addEventListener('click', e => { this.expandPreview(e) })
        this.container.addEventListener('click', e => { this.expandPreview(e) })
        this.summaryContainer.addEventListener('click', e => { this.expandPreview(e) })
      }
    }, 500)


  }

  expandPreview(e){
		this.expanded = true;
    this.card.style.maxHeight = "999px";
    this.card.style.backgroundColor = "white";
    this.centerVerticallyOnScreen();

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

    let steps = Math.ceil(Math.abs(window.pageYOffset - targetY)/100);

    function scroll(timestamp){
      let minRange = targetY - 50;
      let maxRange = targetY + 50;
      if(window.pageYOffset > maxRange) {
        let next = window.pageYOffset - steps;
        window.scrollTo(0, next);
        window.requestAnimationFrame(scroll);
      }
      if(window.pageYOffset < minRange) {
        let next = window.pageYOffset + steps;
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

	///STANDARD
	connectedCallback() {
		//console.log('connected');
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
}

window.customElements.define('ui-job-posting-card', JobPostingCardViewController);

'use strict'
const uiJobPostingCardDoc = document._currentScript || document.currentScript;
const uiJobPostingCardView = uiJobPostingCardDoc.ownerDocument.querySelector('#ui-job-posting-card-view');

class JobPostingCardViewController extends HTMLElement{

	static get observedAttributes(){
		return ['value', 'expanded'];
	}

  constructor(){
    super();
    const view = uiJobPostingCardView.content.cloneNode(true);
		this.shadowRoot = this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(view);

		//set variables
		this.model = new JobPosting();
		this.model.jobLocation = new PostalAddress();
		this.model.hiringOrganization = new Organization();

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
		this.viewPostButton.addEventListener('click', (e) => {
			this._showJobPostingEvent();
		});


		this.$employmentType = this.shadowRoot.querySelector('#employmentType')
		this.$title = this.shadowRoot.querySelector('#title')
    this.$hiringOrganizationName = this.shadowRoot.querySelector('#hiringOrganizationName')
    this.$datePosted = this.shadowRoot.querySelector('#datePosted')
    this.$jobLocation = this.shadowRoot.querySelector('#jobLocation')
    this.$description = this.shadowRoot.querySelector('#description')


    //let loop = setInterval(e=>{
      //if(this.expanded) {
				//console.log('REMOVE EVENT 1')
        //this.card.removeEventListener('click', this.expand)
        //this.container.removeEventListener('click', this.expand)
        //this.summaryContainer.removeEventListener('click', this.expand)
        //this.listening = false;
      //}
      //if(this.isInViewPort() === false){
				//console.log('REMOVE EVENT 2')
        //this.card.removeEventListener('click', this.expand)
        //this.container.removeEventListener('click', this.expand)
        //this.summaryContainer.removeEventListener('click', this.expand)
        //this.listening = false;
      //}
      //if(this.isInViewPort() && this.expanded === false && this.listening === false){
				//console.log('ADDING EVENT')
        this.card.addEventListener('click', this.expand.bind(this))
        this.container.addEventListener('click', this.expand.bind(this))
        this.summaryContainer.addEventListener('click', this.expand.bind(this))
        this.listening = true;
      //}
    //}, 500)
		this.connected = true;
		this._updateRender();
	}

	_updateRender(){
		this.expanded = this.expanded;
		this.value = this.value;
	}

	disconnectedCallback() {
		//console.log('disconnected');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		switch(attrName){
			case 'value':
				//Convert string to object, set
				this.value = JSON.parse(newVal);
				break;
			case 'expanded':
				//Converts string to boolean, sets it
				this.expanded = (newVal === "true");
				break;
			default:
				console.warn(`Attribute ${attrName} not handled`)
		}
	}

	adoptedCallback(){
		//console.log('adoptedCallback');
	}

	get shadowRoot(){ return this._shadowRoot; }
	set shadowRoot(value){ this._shadowRoot = value;}


	get value(){
		let value = JobPosting.assignedProperties(this.model)
		value.jobLocation = PostalAddress.assignedProperties(this.model.jobLocation)
		value.hiringOrganization = PostalAddress.assignedProperties(this.model.hiringOrganization)
		return value;
	}
	set value(value){
		this.model = new JobPosting(value);
		this.model.hiringOrganization = new Organization(value.hiringOrganization);
		this.model.jobLocation = new PostalAddress(value.jobLocation);
		this._updatedEvent();

		if(this.connected){
			this.$employmentType.innerText = this.model.employmentType || 'Employment Type';
			this.$title.innerText = this.model.title || 'Title';
			this.$hiringOrganizationName.innerText = this.model.hiringOrganization.name || 'Hiring Organization';
			this.$datePosted.innerText = this.model.datePosted || 'Date Posted';
			this.$jobLocation.innerText = this.model.jobLocation.addressLocality + ', '+ this.model.jobLocation.addressRegion || 'Job Location';
			this.$description.innerText = this.model.description || 'Description';
		}
	}

	get employmentType(){ return this.model.employmentType; }
	set employmentType(value){
		this.model.employmentType = value;
		this.value = this.model;
	}

	get title(){ return this.model.title; }
	set title(value){
		this.model.title = value;
		this.value = this.model;
	}

	get hiringOrganization(){ return this.model.hiringOrganization; }
	set hiringOrganization(value){
		this.model.hiringOrganization = value;
		this.value = this.model;
	}

	get datePosted(){ return this.model.datePosted; }
	set datePosted(value){
		this.model.datePosted = value;
		this.value = this.model;
	}

	get jobLocation(){ return this.model.jobLocation; }
	set jobLocation(value){
		this.model.jobLocation = value;
		this.value = this.model;
	}

	get description(){ return this.model.description; }
	set description(value){
		this.model.description = value;
		this.value = this.model;
	}

	error(msg){
		this.hidden = true;
		console.error('ERROR: '+msg+', hidding')
	}

	get expanded(){ return this._expanded}
	set expanded(value){
		if(value && this.card){
			this.card.style.maxHeight = "999px";
			this.card.style.backgroundColor = "white";
			this.card.style.cursor= "auto";
			//this.centerVerticallyOnScreen();
			//this.card.style.backgroundColor = "#eff3f7";
			//this.card.style.borderColor ="#37a0e1";
			//this.card.style.borderColor ="#e78880";
			//this.$hiringOrganizationName.style.color = "#7f807f";
			//this.$hiringOrganizationName.style.color = "#c64d5f";

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


		//CLOSE
		//else if(this.card){
		/*     this.card.style.maxHeight = "80px";*/
		//this.$hiringOrganizationName.style.color = "#a4625c";
		//let initOpacity = 1;
		//let displaySummary = (timestamp) => {
		//initOpacity = initOpacity - 0.1;
		//this.summaryContainer.style.opacity = `${initOpacity}`
		//this.actionsContainer.style.opacity = `${initOpacity}`
		//if(initOpacity > 0){
		//window.requestAnimationFrame(displaySummary)
		//} else if (initOpacity <= 0){
		//let wait = setTimeout(() => {
		//this.summaryContainer.style.display = "none";
		//this.actionsContainer.style.display = "none";
		//clearTimeout(wait);
		//console.log('DONE');
		//}, 900);
		//}
		//}
		/*window.requestAnimationFrame(displaySummary)*/
		//}

		if(!this._expanded){ this._expandedEvent(); }
		this._expanded = value;
}


//We use this because an event relays on this function
//and for us to be able to delete the event listener, the function
//cannot be annonimous
expand(e){
	e.preventDefault();
	e.stopPropagation();
	this.expanded = true;
}

_expandedEvent(){
	this.dispatchEvent(new CustomEvent('expanded', {detail: this.expanded, bubbles:false}));
}

_updatedEvent(){
	this.dispatchEvent(new CustomEvent('updated', {detail: this.value, bubbles:false}));
}

_showJobPostingEvent(){
	this.dispatchEvent(new CustomEvent('show-job-posting', {detail: this.value, bubbles:false}));
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

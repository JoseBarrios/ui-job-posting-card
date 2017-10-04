'use strict'
const uiJobPostingCardDoc = document._currentScript || document.currentScript;
const uiJobPostingCardView = uiJobPostingCardDoc.ownerDocument.querySelector('#ui-job-posting-card-view');

class JobPostingCardViewController extends HTMLElement{

	static get observedAttributes(){
		return ['value', 'selected'];
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
		//set state
    this.selected = false;
    this.listening = false;
  }

		///STANDARD
	connectedCallback() {
    this.element = this.shadowRoot.querySelector('#element')
    this.card = this.shadowRoot.querySelector('#card')
    this.container = this.shadowRoot.querySelector('#container');

		this.$employmentType = this.shadowRoot.querySelector('#employmentType')
		this.$title = this.shadowRoot.querySelector('#title')
    this.$hiringOrganizationName = this.shadowRoot.querySelector('#hiringOrganizationName')
    this.$datePosted = this.shadowRoot.querySelector('#datePosted')
    this.$jobLocation = this.shadowRoot.querySelector('#jobLocation')
    this.$description = this.shadowRoot.querySelector('#description')

    this.$info = this.shadowRoot.querySelector('#info')
    this.$buttons = this.shadowRoot.querySelector('#buttons')

    this.$shareButtonLink = this.shadowRoot.querySelector('#shareButtonLink')
		this.$shareButtonLink.setAttribute('url', this.model.url);
    this.$shareButtonEmail = this.shadowRoot.querySelector('#shareButtonEmail')
		this.$shareButtonEmail.setAttribute('url', this.model.url);


		this.clicked = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.selected = true;
		}
		//this.card.addEventListener('click', this.clicked)
		//this.container.addEventListener('click', this.clicked)
		this.element.addEventListener('click', this.clicked)

		this.connected = true;
		this._updateRender();
	}

	_updateRender(){
		this.selected = this.selected;
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
			case 'selected':
				//Converts string to boolean, sets it
				this.selected = (newVal === "true");
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

	get selected(){ return this._selected; }
	set selected(value){
		this._selected = value;

		//SELECTED
		if(this.card && value === true){
			this.card.style.backgroundColor = "#fafafa";
			this.$info.style.display = "none";
			this.$buttons.style.display = "inline-block";
			this._selectedEvent();
		}
		//UNSELECTED
		if(this.card && value === false){
			this.card.style.backgroundColor = "#ffffff";
			this.$buttons.style.display = "none";
			this.$info.style.display = "flex";
			this._unselectedEvent();
		}
	}


	error(msg){
		this.hidden = true;
		console.error('ERROR: '+msg+', hidding')
	}

	get expanded(){ return this._expanded}
	set expanded(value){
		//if(value && this.card){
		//this.card.style.maxHeight = "999px";
			//this.card.style.backgroundColor = "white";
			//this.card.style.cursor= "auto";
			//this.centerVerticallyOnScreen();
			//this.card.style.backgroundColor = "#eeeeee";
			//this.card.style.backgroundColor = "#fafafa";

			//this.card.style.borderColor ="#37a0e1";
			//this.card.style.borderColor ="#e78880";
			//this.$hiringOrganizationName.style.color = "#7f807f";
			//this.$hiringOrganizationName.style.color = "#c64d5f";

			//this.summaryContainer.style.opacity = 1;
			//this.actionsContainer.style.opacity = 1;
			//this.summaryContainer.style.height = "auto";
			//this.actionsContainer.style.height = "auto";
			//this.summaryContainer.style.display = "flex";
			//this.actionsContainer.style.display = "flex";
		//}


		//CLOSE
		//else if(value === false && this.card){
			//this.card.style.maxHeight = "80px";
			//this.summaryContainer.style.display = "none";
			//this.actionsContainer.style.display = "none";
		//}

		//if(!this._expanded){ this._expandedEvent(); }
		//this._expanded = value;
}


//We use this because an event relays on this function
//and for us to be able to delete the event listener, the function
//cannot be annonimous
//toggle(e){
	//e.preventDefault();
	//e.stopPropagation();
	//this.expanded = !this.expanded;
//}

//close(e){
	//e.preventDefault();
	//e.stopPropagation();
	//this.expanded = false;
//}

//open(e){
	//e.preventDefault();
	//e.stopPropagation();
	//this.expanded = true;
//}


_selectedEvent(){
	this.dispatchEvent(new CustomEvent('selected', {detail: this.value, bubbles:false}));
}

_unselectedEvent(){
	this.dispatchEvent(new CustomEvent('unselected', {detail: this.value, bubbles:false}));
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

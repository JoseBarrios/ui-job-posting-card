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
		this.model = {};

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

		this.clicked = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.selected = true;
		}
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

	get value(){ return this.model; }
	set value(value){
		this.model = value;
		this._updateView();
	}

	set identifier(value) {}
	get identifier(){ return this.model.identifier }

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
			this._selectedEvent();
		}
		//UNSELECTED
		if(this.card && value === false){
			this.card.style.backgroundColor = "#ffffff";
			this._unselectedEvent();
		}
	}

	humanizeDate(date){
		let posted = moment(date, 'YYYY-MM-DD');
		let now = moment(Date.now());
		let datePostedInDays = now.diff(posted, 'days');
		let result = 'Posted Today';
		if(datePostedInDays == 1){
			result = `Posted ${datePostedInDays} day ago`;
		}else if(datePostedInDays > 1){
			result = `Posted ${datePostedInDays} days ago`;
		}
		return result;
	}


	error(msg){
		this.hidden = true;
		console.error('ERROR: '+msg+', hidding')
	}

	_updateView(){
		if(this.connected){

			if(this.$employmentType && this.model.employmentType){
				this.$employmentType.innerText = this.model.employmentType || 'Employment Type';
			}

			if(this.$title && this.model.title){
				this.$title.innerText = this.model.title || 'Title';
			}

			if(this.$hiringOrganization && this.model.hiringOrganization){
				this.$hiringOrganizationName.innerText = this.model.hiringOrganization.name || 'Hiring Organization';
			}

			if(this.$datePosted && this.model.datePosted){
				this.$datePosted.innerText = this.humanizeDate(this.model.datePosted);
			}

			if(this.$jobLocation && this.model.jobLocation){
				this.$jobLocation.innerText = this.model.jobLocation.addressLocality + ', '+ this.model.jobLocation.addressRegion || 'Job Location';
			}

			if(this.$description && this.model.description){
				this.$description.innerText = this.model.description || 'Description';
			}
		}

		this._updatedEvent();
	}

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

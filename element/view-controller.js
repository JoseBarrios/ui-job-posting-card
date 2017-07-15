'use strict'
let currentDocument = document.currentScript.ownerDocument;

class JobPostingCardViewController extends HTMLElement{

  constructor(){
    super();
    const template = currentDocument.querySelector('#view').content.cloneNode(true);
    this.appendChild(template);
    this.dataController = new JobPosting();
  }

  ///STANDARD
  connectedCallback() {
    console.log('connected');
  }

  disconnectedCallback() {
    console.log('disconnected');
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChanged');
  }

  adoptedCallback(){
    console.log('adoptedCallback');
  }
}

window.customElements.define('ui-job-posting-card', JobPostingCardViewController);

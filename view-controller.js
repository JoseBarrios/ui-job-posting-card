'use strict'

const lodashURL = 'node_modules/lodash/lodash.js';
const dataControllerURL = '@josebarrios/thing/index.js';

let currentDocument = document.currentScript.ownerDocument;

let options = {};
options.map = {};
options.map.lodash = lodashURL;
SystemJS.config(options)
SystemJS.import(dataControllerURL).then(JobPostingDataController => {

  console.log('THING', JobPostingDataController)

  //UIJobPostingController
  class JobPostingCardViewController extends HTMLElement{

    constructor(){
      super();
      const template = currentDocument.querySelector('#view').content.cloneNode(true);
      this.appendChild(template);
      console.log('HELLO')
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
})

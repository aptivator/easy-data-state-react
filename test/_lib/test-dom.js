import {JSDOM} from 'jsdom';

let dom = new JSDOM(`<div id="root"></div>`);
let {window} = dom;
let {document} = window;
let rootContainer = document.getElementById('root');
Object.assign(global, {document, window});
  
export {rootContainer};

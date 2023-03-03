import { forceObject, forceArray, forceNumber } from './forceType.js';

function fullscreen (object){
	if (object.requestFullScreen){ object.requestFullScreen(); }                  /* Default */
	else if (object.webkitRequestFullscreen){ object.webkitRequestFullscreen(); } /* Safari  */
	else if (object.msRequestFullscreen){ object.msRequestFullscreen(); }         /* IE11    */

	return object;
}

Function.prototype.clone = function() {
  let cloneObj = this.__isClone ? this.__clonedFrom : this;
  let temp     = () => cloneObj.apply(this, arguments);

  for(const key in this)
		temp[key] = this[key];

  temp.__isClone = true;
  temp.__clonedFrom = cloneObj;

  return temp;
};

function isElement(obj) {
  try { return obj instanceof HTMLElement; }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

const elOverride = {
	get: {
		append (...objs){
			if (objs.length < 1)
				return;

			for (let el of objs)
				if (Array.isArray(el)){					
					const i = objs.indexOf(el);

					objs.splice(i, i + el.length);

					objs.push(...el);
				}
	
			for (let el of objs)
				this.node.append(
					el?.constructor == '_M_NODE' ? el.node : el
				);
			
			return this;
		}
	}
}

const addListenersToNode = (node, events) => {
	node.listeners ??= {};
	const { listeners: group } = node;
	
	for (const key in events)
		for (const listener in events[key]){
			group[key] ??= {};

			group[key][listener] = events[key][listener];

			node.node.addEventListener(listener, group[key][listener]);
		}

	return this;
}

const removeListenersFromNode = (node, key) => {
	node.listeners ??= {};
	const { listeners: group } = node;

	for (const listener in group[key])
		node.node.removeEventListener(listener, group[key][listener]);

	return this;
}

const elUtils = {
	get: {
		text (content){
			this.node.innerText = content;

			return this;
		},

		attr (attributes = {}){
			if (typeof attributes != 'object')
				return;

			for (const [key, value] of Object.entries(attributes))
				this.node.setAttribute(key, value);
			
			return this;
		},

		styles (styles = {}){
			if (typeof styles != 'object')
				return;

			for (const [key, value] of Object.entries(styles))
				this.node.style[key] = value;
			
			return this;
		},

		class (...args){
			this.node.className = args.join(' ');

			return this;
		},
		
		addClass (...args) {
			this.node.classList.add(...forceArray(args));

			return this;
		},

		removeClass (...args) {
			this.node.classList.remove(...forceArray(args));

			return this;
		},

		toggleClass (...classNames){
			const has = (className) => this.node.classList.contains(className);

			for (let className of classNames)
				this.classList[has(className) ? 'remove' : 'add'](className);

			return this;
		},

		hasClass (className){
			return this.node.classList.contains(className);
		},

		fullscreen (){
			fullscreen(this.node);
			
			return this;
		},

		swap (el){
			const newNode = el?.constructor == '_M_NODE' ? el.node : el;
			
			this.node.replaceWith(newNode);
			this.node = newNode;

			return this;
		},

		clone (){
			return generateProxyNode(this.node.cloneNode(true));
		},

		on (event, func) {
			addListenersToNode(this, {
				temp: {
					[event]: func
				}
			});

			return this;
		},


		addListener (events) {
			addListenersToNode(this, events);

			return this;
		},

  	removeListener (key) {
			removeListenersFromNode(this, key);

			return this;
		},

		empty (){
			this.node.innerText = '';

			return this;
		}
  
	}
}

function generateProxyNode (el){
	el.constructor = '_M_NODE';

	if (!isElement(el))
		return new Proxy({}, {
			get () { return;    },
			set () { return {}; }
		});

	const nodeProxy = new Proxy(() => 0, {
		apply (fnc, thisArg, argumentsList){
			return elOverride.get.append.bind(nodeProxy)(...argumentsList);
		},

		get (fnc, prop) {
			if (prop === 'node')
				return el;

			if (elOverride?.get.hasOwnProperty(prop))
				return elOverride?.get[prop].bind(nodeProxy);

			if (prop in el){
				if (typeof el[prop] === 'function')
					return el[prop].bind(el);

				return el[prop];
			}

			if (elUtils?.get?.hasOwnProperty(prop)){
				const util = elUtils?.get?.[prop];

				return typeof util == 'function' ? util.bind(nodeProxy) : util;
			}
		},
		set (fnc, prop, value) {
			if (prop === 'node')
				el = value;

			if (elUtils?.set?.hasOwnProperty(prop))
				return elUtils?.set?.[prop].bind(nodeProxy)(value);

			return Reflect.set(el, prop, value);
		}
	})

	return nodeProxy;
}

const newNode = new Proxy({}, {
	get(target, elementTag) {
    return generateProxyNode(
			document.createElement(elementTag)
		);
  }
});

const qs = (selector) => generateProxyNode(
	document.querySelector(selector)
);

const fetch = async ({ url, format }, options) => {
	const res = await fetch(url, options);

	try {
		const jsonData = await res.json();
	}
	catch (e){
		console.log(e)
	}

	e.json = () => e.response.json();
	e.text = () => e.response.text();

	return e;
}

export {
	newNode,
	qs,
	fetch,
	generateProxyNode
}
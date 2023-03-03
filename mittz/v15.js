window["orago's tool kit"] = {
  parseUrl: function (url = window.location.href) {
      var parser = document.createElement('a');
      parser.url = parser.href = url;
      parser.regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
      parser.valid = parser.isValid = parser.regex.test(url);
      parser.pathsold = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/"
      parser.paths = parser.pathname.startsWith("/") ? parser.pathname.replace("/", "").split("/") : parser.pathname.split("/");
      parser.pathsnf = [];
      parser.paths.forEach( (item, index) => { if (item.includes(".")) return; parser.pathsnf.push(item); });
      parser.params = (new URL(url)).searchParams;
      parser.all = JSON.stringify({...parser, href: parser.href, host: parser.host, pathname: parser.pathname, search: parser.search, port: parser.port, protocol: parser.protocol});
      return parser;
  },
  slider:   function slider(obj, axis){
    var slider_ROOT = this;

    this.axis    = axis;
    this.object  = obj;
    this.mouseUp = (obj) => {
      obj.setAttribute("isDown", "false");
      obj.classList.remove('active');
    };

    this.mouseDown = (e, obj, allow) => {
      if ( e.target.tagName == "DIV" && e.target.classList.contains("post") ) return obj.setAttribute("isDown", "false");

      obj.setAttribute("isDown", "true");
      obj.parentElement.classList.add('active');

      if ( allow.includes("x") ){ obj.setAttribute( "startX", e.pageX - obj.offsetLeft );  obj.setAttribute( "scrollX", obj.scrollLeft ); }
      if ( allow.includes("y") ){ obj.setAttribute( "startY", e.pageY - obj.offsetTop  );  obj.setAttribute( "scrollY", obj.scrollTop  ); }
    }

    this.mouseMove = (e, obj, allow) => {
      if(slider_ROOT.object.getAttribute("isDown") != "true") return;

      e.preventDefault();

      if (allow.includes("x")){
        const c        = e.pageX - obj.offsetLeft,
              walk     = ( c - Number( obj.getAttribute("startX") ) ) * 3;
        obj.scrollLeft = ( Number( obj.getAttribute("scrollX") ) - walk);
      }
      if (allow.includes("y")){
        const c       = e.pageY - obj.offsetTop,
              walk    = ( c - Number( obj.getAttribute("startY") ) ) * 3;
        obj.scrollTop = ( Number( obj.getAttribute("scrollY") ) - walk );
      }
    }

    obj.addEventListener("mouseup",   () => this.mouseUp  (   this.object      ) );
    obj.addEventListener("mousedown", e  => this.mouseDown(e, this.object, axis) );
    obj.addEventListener("mousemove", e  => this.mouseMove(e, this.object, axis) );
  },
  draggable: function dragElement(element, axis = "xy", values = {}) {
    var 
      startX = 0,                  startY = 0, 
      endX   = 0,                  endY   = 0,
      axisX  = axis.includes("x"), axisY  = axis.includes("y"),
      foundChild = false,
      handle = values.handle,
      regions = values.regions || {},
      func = values.function;

    if (!regions.x) regions.x = { };      
    if (!regions.y) regions.y = { };


    element.childNodes.forEach( obj => {
      if (obj == element.querySelector(handle)) foundChild = obj;
     });

    let el = (handle == null ? element : foundChild);
    el.addEventListener("touchstart", dragMouseDown);
    el.addEventListener("mousedown",  dragMouseDown);

    if (handle !== null && foundChild !== false) foundChild.style.cursor = "move";

    elementDrag({ clientX: 0, clientY: 0, preventDefault: () => '' });



    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0];

      let style = element.style;

      if (style.positon != "absolute" && style.position != "fixed") element.style.position = "absolute";

      if (axisX) endX = e.clientX;
      if (axisY) endY = e.clientY;

      window.addEventListener("touchmove", elementDrag);
      window.addEventListener("mousemove", elementDrag);

      window.addEventListener("touchend", closeDragElement);
      window.addEventListener("mouseup", closeDragElement);
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0];

      var newX = e.clientX, newY = e.clientY;

      if (regions.x.min == null) regions.x.min = 0;
      if (regions.x.max == null) regions.x.max = document.documentElement.clientWidth;

      if (regions.y.min == null) regions.x.min = 0;
      if (regions.y.max == null) regions.x.max = document.documentElement.clientHeight;

      if (newX > regions.x.min) newX = regions.x.max;
      if (newX < regions.x.max) newX = regions.x.min;

      if (newY > regions.y.max) newY = regions.y.max;
      if (newY < regions.y.min) newY = regions.y.min;

      if (func) func();

      if (axisX){ startX = endX - newX;  endX = newX;  element.style.left = ( element.offsetLeft - startX ) + "px"; }
      if (axisY){ startY = endY - newY;  endY = newY;  element.style.top  = ( element.offsetTop  - startY ) + "px"; }
    }

    let closeDragElement = () => {
      window.removeEventListener("touchmove", elementDrag);
      window.removeEventListener("mousemove", elementDrag);
      window.removeEventListener("touchend", closeDragElement);
      window.removeEventListener("mouseup", closeDragElement);
    }
  },
  fullscreen: function (object){
    if (object.requestFullScreen){ object.requestFullScreen(); }                  /* Default */
    else if (object.webkitRequestFullscreen){ object.webkitRequestFullscreen(); } /* Safari  */
    else if (object.msRequestFullscreen){ object.msRequestFullscreen(); }         /* IE11    */
  }
}



var otk = window["orago's tool kit"];

var _M_Storage = {
  listeners: {}
};

class _M_nodeObject {
  constructor(tag = "div", premethods) {
    this.root = _M;
    this.constructor = "_M_NODE"
    this.nodeObject = document.createElement(tag);
    this.vars = {};

    if (this.nodeObject.constructor == String && this.nodeObject != null){
        let tempString            = this.nodeObject;
        this.nodeObject           = document.createElement(tag);
        this.nodeObject.innerText = tempString;
    };
    
    if (premethods) this.shorthand(premethods);
  }

  addListenersToNode = (events) => {
    let group = _M_Storage.listeners;

    for (let key in events){
      for (let listener in events[key]){
        if (!group[key]) group[key] = {};

        group[key][listener] = events[key][listener];
        this.nodeObject.addEventListener(listener, group[key][listener]);
      }
    }

    return this;
  }
  
  removeListenersFromNode = (key) => {
    let group = _M_Storage.listeners;

    for (let listener in group[key]) this.nodeObject.removeEventListener(listener, group[key][listener]);

    return this;
  }
  
  append         = (...objs)        => { if (objs.length < 1) return; let a = objs; for (let i in a){ this.nodeObject.append( a[i].constructor == "_M_NODE" ? a[i].nodeObject : a[i] ); } return this; }
  appendTo       = parentNode       => { (parentNode.constructor == "node" ? parentNode.nodeObject : parentNode).append(this.nodeObject);                 return this; }
  appendCloneTo  = parentNode       => { (parentNode.constructor == "node" ? parentNode.nodeObject : parentNode).append(this.nodeObject.cloneNode(true)); return this; }
  empty          = (              ) => { this.nodeObject.innerText                              = '';                                                     return this; }
  id             = newID            => { this.nodeObject.id                                     = newID;                                                  return this; }
  setText        = text             => { this.nodeObject.innerText                              = text;                                                   return this; }
  addText        = text             => { this.nodeObject.innerText                             += text;                                                   return this; }
  className      = classes          => { this.nodeObject.className                              = classes;                                                return this; }
  qs             = nodeName         => { this.nodeObject                                        = document.querySelector(nodeName);                       return this; }
  html           = text             => { this.nodeObject.innerHTML                              = text;                                                   return this; }
  inner          = text             => { this.nodeObject.innerHTML                              = text;                                                   return this; }
  addInner       = text             => { this.nodeObject.innerHTML                              += text;                                                   return this; }
  outer          = text             => { this.nodeObject.outerHTML                              = text;                                                   return this; }
  set            = givenNode        => { this.nodeObject                                        = givenNode;                                              return this; }
  attr           = attr             => { for (let key in attr)       this.nodeObject.setAttribute(key, attr[key]);                                        return this; }
  property       = prop             => { for (let key in prop)       this.nodeObject[key]       = prop[key];                                              return this; }
  style          = jsonStyles       => { for (let key in jsonStyles) this.nodeObject.style[key] = jsonStyles[key];                                        return this; }
  clone          = (              ) => { let _MNN = _M.node().set(this.nodeObject.cloneNode(true));                                                       return _MNN; }
  attachSlider   = axis             => { otk.slider(this.nodeObject, axis);                                                                               return this; }
  draggable      = ( axis,   data ) => { otk.draggable(this.nodeObject, axis, data);                                                                      return this; }
  remove         = (              ) => { this.nodeObject.remove();                                                                                        return null; }
  listen         = (event,    func) => { this.addListenersToNode({ "temp": {  [event]: func  } });                                                        return this; }
  addListener    = events           => { this.addListenersToNode(events);                                                                                 return this; }
  removeListener = key              => { this.removeListenersFromNode(key);                                                                               return this; }
  funcObj        = run              => { run(this.nodeObject);                                                                                            return this; }
  nodeAnd        = run              => { run.bind(this)(this);                                                                                                       return this; }
  shorthand      = m   /* Methods*/ => { Object.keys(m).forEach( v /*Val*/ => this.root.and( m[v].constructor == Array ? m[v] : [m[v]], res => _M.jsonPathFinder(this, v)(...res) )); return this; }
  click          = (              ) => { this.nodeObject.click();                                                                                         return this; }
  fullscreen     = (              ) => { otk.fullscreen(this.nodeObject);                                                                                 return this; }
  
  scroll = {
    top:    () => this.nodeObject.scrollTop = 0,
    bottom: () => this.nodeObject.scrollTop = this.nodeObject.scrollHeight
  }
  
  class = {
    add:    (nameOfClass) => { this.nodeObject.classList.add(nameOfClass);    return this; },
    remove: (nameOfClass) => { this.nodeObject.classList.remove(nameOfClass); return this; }
  }
}

class _M_Number {
  constructor(number = 0){
    this.number = isNaN(number) ? 0 : number;
  }
  
  pi         = (                    ) => Math.pi;
  thousands  = (                    ) => Number(this.number).toLocaleString();
  money      = (                    ) => `$${this.thousands()}`;
  add        = a                      => { this.number += a;                return this; }
  subtract   = a                      => { this.number -= a;                return this; }
  multiply   = a                      => { this.number *= a;                return this; }
  divide     = a                      => { this.number /= a;                return this; }
  power      = a                      => { this.number = Math.pow(this, a); return this; }
  and        = run                    => {                      return run(this.number); }
  difference = (num, e = this.number) => { return e - num > 0 ? e - num : (e - num) * -1 }
  random     = ( min = 0,  max = 50 ) => { this.number = Math.floor( Math.random() * ( max - min ) + min ); return this; }
  contain    = bits                   => {                                       return Math.floor( this.number / bits); }
}

class _M_Cookie {
  constructor (){
    
  }
  set = function (cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  get = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}

class _M_Repeater {
  constructor (){
    this.endFrame = 0;
    this.paused   = false; //* [ paused ] part of the 'togglePause' state function\
    this.frame    = {
      filterStrength: 20,
      interval: 16,
      count:    0,
      frameTime: 1,
      lastLoop: new Date,
      start: performance.now()
    };
    
    this.queue = [];

    let f = this.frame;
  }

  togglePause () {
    this.paused = (this.paused == true ? false : true);
    if (this.paused == false) this.run(this.update);
  }

  pause () {
    this.paused = true;
  }

  unpause () {
    if (this.paused == false) return;
    this.paused == false;
    this.run(this.update);
  }

  run (v) {
    let { frame: f, endFrame: ef } = this;
    let { update } = v;

    if (this.queue.length > 0){
      this.queue[0]();
      this.queue.shift();
      return requestAnimationFrame(this.run.bind(this, v));
    }

    f.thisFrameTime = (f.thisLoop = new Date) - f.lastLoop;
    f.frameTime += (f.thisFrameTime - f.frameTime) / f.filterStrength;
    f.lastLoop = f.thisLoop;
    f.fps = Math.floor(1000 / f.frameTime);

    f.delta = performance.now() - f.start;

    if (f.delta >= f.interval) {
      update(this);

      f.start = null;
      f.count++;
    };


    if (this.paused == true || (ef && ef < f.count && ef > 0)) return false;

    requestAnimationFrame(this.run.bind(this, v));
  };

  update = () => {};

  start = (e) => {
    this.run(e);
  }
}

class _M_Image {
  constructor (_M){
    if (!_M.cache.images) _M.cache.images = {};
    this.cache = _M.cache.images;
  }

  get = (key) => this.cache[key];

  load = async (key, url) => {
    this.cache[key] = new Image();
    await new Promise(r => this.cache[key].onload = r, this.cache[key].src = url);
    return true;
  }

  loadMultiple = async (values) => {
    let vals = Object.keys(values);

    await new Promise(r => {
      vals.forEach(async (name, index) => {
        await this.load(name, values[name]);
        if (index == vals.length-1) r(true);
      });
    });

    return true;
  }
}

class _M_Cursor {
  constructor (object = document.body){
    this.pos = {
      x: 0, y: 0, clicking: false
    };

    this.click = {};
    this.release = {};
    this.start = {
      x: 0, y: 0
    };
    this.end = {
      x: 0, y:0
    }
    this.button = -1;


    object.addEventListener("mousemove", (e) => {
      this.pos.x = e.clientX
      this.pos.y = e.clientY
    });

    object.addEventListener("mousedown", (e) => {
      ((m) => Object.keys(m).forEach(f => m[f](this)) )(this.click);

      this.button = e.button;
      this.start = { x: this.pos.x, y: this.pos.y };

      this.clicking = true;
    });

    object.addEventListener("mouseup",   (e) => {
      ((m) => Object.keys(m).forEach(f => m[f](this)) )(this.release);
      
      this.button = e.button;
      this.end = { x: this.pos.x, y: this.pos.y };

      this.clicking = false;
    });
  }
}

class _M_Keyboard {
  constructor(object = window) {
    this.keysPressed = {};
    this.onkey = function () {};

    object.onkeyup = (e) => delete this.keysPressed[String.fromCharCode(e.keyCode)];

    object.onkeydown = (e) => {
      let kc = String.fromCharCode(e.keyCode);
      if (this.isPressed(kc) == false) this.onkey(kc);
      this.keysPressed[kc] = true;
    }
  }

  anyPressed = function () {
    let args = Object.keys(arguments);

    for (var i = 0; i < args.length; i++)
      if (this.keysPressed[arguments[args[i]]] == true){
        return true;
      }

    return false;
  }

  isPressed = (e) => this.keysPressed[e] == true;
}
  

var _M = {
  about: {
    name: "Mittz.JS"
  },
  test: (...args) => console.log(args),
  title: (title) => document.title = title,
  icon: (icon = { type: "symbol", value: "_" }, color = "black", fontSize = 70) => {
    if (!icon) return;
    const svgUrl = `data:image/svg+xml, <svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22`+color+`%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%22`+fontSize+`%22>` + icon.value + `</text></svg>`;

    const link = document.createElement("link");
    link.rel = "shortcut icon";
    link.type = "image/svg+xml";
    link.href = ["symbol", "image"].includes(icon.type) ? ( icon.type == 'symbol'? svgUrl : icon.value ) : " ";
    document.head.appendChild(link);
  },
  get: async function (data, options) {
    let { url, format } = data;
    
    if (!url)                                   return false;
    else if (format == "json")                  return await fetch(url, options).then(e => e.json());
    else if (["text", "html"].includes(format)) return await fetch(url, options).then(e => e.text());
    else                                        return await fetch(url, options);
  },
  fetch: async (data, options) => {
    let { url, format } = data;
    let e = {};

    e.response = await fetch(url, options);

    e.json = () => e.response.json();
    e.text = () => e.response.text();

    return e;
  },
  fetchAppend: async function (object, url) {
    await this.get({ format: "html", url }).then((content) => object.innerHTML += content );
    return true;
  },
  fetchSet   : async function (object, url) {
    await this.get({ format: "html", url }).then((content) => object.innerHTML = content); 
    return true; 
  },
  bindData: (object, data) => {
    Object.keys(data).forEach( key => {
      object[key] = data[key];
    });
    return object;
  },
  qs: (obj, parent = document) => parent.querySelector(obj),
  qsAll: value                 => document.querySelectorAll(value),
  random         : ( min = 0, max = 50 ) => Math.floor( Math.random() * ( max - min ) + min ),
  max            : ( input,   max = 10 ) => ( input < max ) ? input : max,
  integ          : ( input,       bits ) => Math.floor( input / bits),
  prototype      : ( name,       value ) => this[name] = value,
  and            : ( object,        run) => { return run(object); },
  randomFromArray: array                 => array[ Math.floor( Math.random() * array.length ) ],
  caps           : text                  => text.charAt(0).toUpperCase() + text.slice(1),
  a0             : txt                   => /[^a-z0-9]/i.test(txt),
  htmlCheck      : txt                   => /<\s*[^>]*>/g.test(txt),
  firstUpper     : txt                   => txt.slice(0, 1).toUpperCase() + txt.slice(1, txt.length).toLowerCase(),
  randomArray    : array                 => array[this.random(0, array.length-1)],
  difference     : (e1,              e2) => e1 - e2 > 0 ? e1 - e2 : (e1 - e2) * -1,
  redirect       : url                   => window.location.href = url,
  redirectPath   : fullPath              => window.location.href = _M.parseUrl().protocol+'//'+_M.parseUrl().host+fullPath,
  hexToRGB       : (h)                   => {
    if (h.includes("#")) h = h.replace(/#/g, "");
    if (h.length != 6)   throw "Only hex colors allowed.";

    let r = h.match(/.{1,2}/g);
    return [ parseInt(r[0], 16), parseInt(r[1], 16), parseInt(r[2], 16) ];
  },
  randomString: ( length, start = '' ) => {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', i = 0, result = '';
    
    for (;i<length;i++) result += chars.charAt( this.random(0, chars.length) );
    
    return result;
  },
  match: (text, values) => {
    let c = values.constructor;

    if (c == String || c == (0).constructor)
      return text == values;
    
    if (c == Array){
      for (let i in values)
        if (text == values[i])
          return true; /* | */ return false;
    } 
    else throw "Could not get valid match types "+values;
  },
  jsonPathFinder: (json, path) => {
    let cDir = json, paths = path.split(".");

    for (let partID in paths){
      let part = paths[partID];
      
      if (cDir.hasOwnProperty(part)){
        cDir = cDir[part];
        if (partID == paths.length-1) return cDir;
      }
      else return null;
    }
  },
  weightedRandom: function ( o /* Options */ ) {
    var i, w /* Weights */ = [];
    for (i = 0; i < o.length; i++) w[i] = o[i].probability + (w[i - 1] || 0);
    var rand = Math.random() * w[w.length - 1];
    for (i = 0; i < w.length; i++) if (w[i] > rand) break;
    return o[i].item;
  },
  copyTxt: (text) => {
    if (!navigator.clipboard) {
      this.fallbackCopyTxt(text);
      return;
    }
    navigator.clipboard.writeText(text);
  },
  fallbackCopyTxt: function (text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }
}
  
  _M.parseUrl = window["orago's tool kit"].parseUrl;
  _M.node = function (){ return new _M_nodeObject(...arguments); };
  _M.nodes = function (nodes){ return [...nodes].map(node => new this.base_ROOT.node().set(node)) };

  _M.number = function (){ return new _M_Number(...arguments); };
  _M.cookie = function (){ return new _M_Cookie(...arguments); };
  _M.repeater = function (){ return new _M_Repeater(...arguments); };

  _M.image = function (){ return new _M_Image(_M); };
  _M.cursor = function (object){ return new _M_Cursor(object); };
  _M.keyboard = function (object){ return new _M_Keyboard(object); };

  _M.url = function (object){

    class _M_Url {
      constructor(url = window.location.href){
        this.url = (new URL(url));

        this.settings = {
          regexValidation: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g
        }
      }

      

      fetch = async (data, options) => {
        let { url, format } = data;
        let e = {};

        this.response = await fetch(url, options);
        this.json = () => this.response.json();
        this.text = () => this.response.text();

        return this;
      }

      valid  = () => settings.regexValidation.test(this.url);

      params = () => this.url.searchParams;

      pathArray = () => {
        let { pathname: pn } = this.url;
        let paths = pn.startsWith("/") ? pn.replace("/", "").split("/") : pn.split("/"),
            pathsnf = [];

        paths.forEach( (item, index) => {
          if (item.includes(".")) return;
          else pathsnf.push(item);
        });

        return pathsnf;
      };

      query = (replace = false) => {
        return {
          set: (key, value) => {
            let params = this.url.searchParams;

            if (params.has(key)) params.delete(key);

            params.append(key, value);

            let newUrl = window.origin + "?" +params.toString();

            if (replace == true) window.history.replaceState({ path: newUrl }, '', newUrl);

            return newUrl;
          },
          get: (key) => this.url.searchParams.get(key),
          obj: () => this.url.searchParams,
          clear: () => {
            if (replace == true) window.history.replaceState({ path: window.origin }, '', window.origin)
          }
        }

      }
    
    }

    return new _M_Url(object);
  }

_M.base_ROOT = _M;
  
Function.prototype.clone = function() {
    var cloneObj = this.__isClone ? this.__clonedFrom : this;
    var temp     = () => cloneObj.apply(this, arguments);
  
    for(var key in this) temp[key] = this[key];
  
    temp.__isClone = true;
    temp.__clonedFrom = cloneObj;
  
    return temp;
  };
export default class keyboard {
  constructor(object = document.body) {
    this.keysPressed = {};
    this.keyEvents = {

    }
    this.onkey = function () {};

    object.addEventListener('keyup', e => {
      delete this.keysPressed[e.key];
    });
    
    object.addEventListener('keydown', e => {
      let k = (e.key || '').toLowerCase();

      if (this.isPressed(k) == false && typeof this.keyEvents[k] == 'object')
          for (const func of Object.values(this.keyEvents[k]))
            func();
      
      this.keysPressed[k] = true;
    });
  }

  on = function (key, [name, func]){
    if (typeof this.keyEvents?.[key] !== 'object')
      this.keyEvents[key] = {};

    this.keyEvents[key][name] = func;
  }

  disconnect = function (key, name){
    if (typeof this.keyEvents?.[key] !== 'object')
      return;

    delete this.keyEvents[key][name];
  }

  anyPressed = function (...args) {
    for (const key of args)
      if (this.isPressed(key))
        return true;

    return false;
  }

  isPressed = (e = '') => this.keysPressed[e.toLowerCase()] == true;
  
  intPressed = (e = '') => this.keysPressed[e.toLowerCase()] == true ? 1 : 0;

  mapInt = function (...characters) { 
    const chars = {};

    for (const character of characters)
      chars[character] = this.intPressed(character);

    return chars;
  }
}
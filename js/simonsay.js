class Color {
  constructor(name, button) {
    this.name = name;
    this.button = button;
    this.velocity = 350;
    this.press = this.press.bind(this);
    this.events = [];
  }

  activate() {
    this.button.addEventListener('click', this.press);
    return this;
  }

  deactivate() {
    this.button.removeEventListener('click', this.press);
    return this;
  }

  toIlimunite() {
    return new Promise((resolve) => {
      this.button.classList.add('light');
      setTimeout(() => {
        this.offColor();
        resolve(this);
      }, this.velocity);
    });
  }

  offColor() {
    this.button.classList.remove('light');
  }

  press() {
    return this.toIlimunite().then(() => {
      this.callPress(this);
    });
  }

  onPress(callback) {
    this.events.push(callback);
  }

  callPress(elem) {
    this.events.forEach(event => event(elem));
  }
}

class Game {
  constructor(colors) {
    this.level = 1;
    this.subLevel = 0;
    this.press = this.press.bind(this);
    this.colors = colors;
    this.velocity = 1000;
    this.atachEventPress();
    this.nextLevel();
  }

  atachEventPress() {
    this.colors.forEach(color => color.onPress(this.press));
  }

  activateColors() {
    this.colors.forEach(color => color.activate());
  }

  deactivateColors() {
    this.colors.forEach(color => color.deactivate());
  }

  generateSecuence(quantity) {
    const large = this.colors.length;
    this.secuence = Array(quantity).fill(0);
    this.secuence = this.secuence.map(() => Math.floor(Math.random() * large));
  }

  async playSecuence() {
    this.deactivateColors();
    // TODO: Corregir pasar a foreach
    for (let i of this.secuence) {
      await this.colors[i].toIlimunite();
      await new Promise(resolve => setTimeout(() => resolve(), this.velocity));
    }
    this.activateColors();
  }

  nextLevel() {
    this.level += 1;
    this.subLevel = 0;
    this.generateSecuence(this.level);
    this.playSecuence();
  }

  press(colorPress) {
    const pos = this.secuence[this.subLevel];
    const color = this.colors[pos];
    if (colorPress === color) {
      this.subLevel += 1;
      if (this.subLevel > this.secuence.length - 1) {
        console.log('congrats!, nextlevel');
        setTimeout(() => this.nextLevel(), 2000);
      }
    } else {
      console.log('gameOver!');
      this.deactivateColors();
    }
  }
}

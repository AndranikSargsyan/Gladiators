const faker = require('./faker');

class Gladiator {
  constructor(scene, name, health, power, speed) {
    this.scene = scene;
    this.name = name;
    this.health = health;
    this.power = power;
    this.speed = speed;
    this.alive = true;
    this.timeToHit = 5000;
  }

  decreaseHealthByAmount(amount) {
    if(this.alive) {
      this.health = this.health - amount;

      if(this.health <= 0) {
        this.alive = false;
      }

      if(this.health < 30 && this.health > 15) {
        this.speed = this.speed * 3;
        console.log(`${this.name}'s speed tripled`);
      } else {
        this.speed = this.speed * (this.health/(this.health+amount));
      }
    }
  }

  hit() {
    let opponent = this.scene.getRandomGladiatorFor(this);
    if(opponent.isAlive) {
      console.log(`[${this.name} x ${this.health.toFixed(1)}] hits [${opponent.name} x ${opponent.health.toFixed(1)}] with power ${this.power.toFixed(1)}`);
      opponent.decreaseHealthByAmount(this.power);
    }
  }

  update() {
    this.timeToHit -= this.speed * 100;

    if(this.timeToHit <= 0 && this.alive) {
      this.hit();
      this.timeToHit = 5000;
    }
  }

  get getName() {
    return this.name;
  }

  get getHealth() {
    return this.health;
  }

  get isAlive() {
    return this.alive;
  }

  recover() {
    this.health = 50;
    this.alive = true;
  }
}

class Scene {
  constructor(n) {
    this.gladiators = [];

    for(let i = 0; i < n; i++) {
      let randomName = faker.name.findName();
      let randomHealth = Math.floor(Math.random() * (100 - 80 + 1)) + 80
      let randomPower =  (Math.random() * (5 - 2) + 2);
      let randomSpeed = (Math.random() * (5 - 1) + 1);

      this.gladiators.push(new Gladiator(this, randomName, randomHealth, randomPower, randomSpeed));
    }

    this.update();
  }

  getRandomGladiatorFor(currentGladiator) {
    let currentIndex = this.gladiators.indexOf(currentGladiator);
    let opponentIndex = currentIndex;
    while(opponentIndex == currentIndex) {
      opponentIndex = Math.floor(Math.random() * (this.gladiators.length));
    }
    return this.gladiators[opponentIndex];
  }

  update() {
    if(this.gladiators.length < 2) {

      let winner = this.gladiators[0];
      console.log(`${winner.getName} won the battle with health ${winner.getHealth.toFixed(1)}`);

    } else {

      for (let gladiator of this.gladiators) {
        gladiator.update();

        if(gladiator.getHealth <= 0) {

          console.log(`[${gladiator.name}] is dying`);

          if(Math.random() < 0.5) {

            console.log(`Caesar showed :( to [${gladiator.getName}]`);
            let gIndex = this.gladiators.indexOf(gladiator);
            this.gladiators.splice(gIndex, 1);

          } else {

            console.log(`Caesar showed :) to [${gladiator.getName}]`);
            gladiator.recover();

          }
        }
      }
      setTimeout(this.update.bind(this), 100);
    }

  }
}

function start(n) {
  const scene = new Scene(n);
}

start(10);

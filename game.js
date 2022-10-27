import { size, playersize, bagsize, ratio, random, checkMovement } from "./functions.js";
const speed = 300;

const weapons = {
  pistol: 30
}

class gamescene extends Phaser.Scene {
  constructor(){
    super();
  }
  
  preload() {
    this.load.image("player", "assets/nave.png");
    this.load.image("inimigo", "assets/inimigo.png");
    this.load.image("bag", "assets/bullet.png");
    this.load.image("universo", "assets/mapa.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("pistol", "assets/mira.png");
    this.load.spritesheet("explode", "assests/explode.png"); // Nova adição
  }

  create() {

    /*
    var config1 = {
        key: "boom",
        frames: "explode",
        hideOnComplete: true
    };
    this.anims.create(config1);
    */

    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    for(let i = size / (ratio * 2); i < size; i += size / ratio){
      for(let j = size / (ratio * 2); j < size; j += size / ratio){
        let universo = this.physics.add.image(i, j, "universo").setDepth(0);
      }
    }

    this.bags = this.physics.add.group();
    for(let i = 0; i < random(30, 50); i++){
      this.bags.create(random(bagsize / 2, size - bagsize / 2), random(bagsize / 2, size - bagsize / 2), "bag").setScale(0.75, 0.75);
    }

    this.player = this.physics.add.sprite(random(playersize / 2, size - playersize / 2), random(playersize / 2, size - playersize / 2), "player").setScale(0.75, 0.75).setDepth(1);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, size, size);
    this.player.setCollideWorldBounds(true);


    this.pistol = this.physics.add.sprite(this.player.x, this.player.y, "pistol").setDepth(2).setScale(0, 0); //Mudança que deixa a arma inv

    this.pistol.angle2 = 0;

    this.addDemons();
    this.bullets = this.physics.add.group();
    this.physics.world.setFPS(120);


    this.health = 100; //Fazer possível mudança na vida
    this.healthtext = this.add.text(100, 50, "Vida", { fontFamily: "Arial", fontSize: 30 }).setDepth(10);
    this.healthtext.scrollFactorX = 0;
    this.healthtext.scrollFactorY = 0;

    this.healthbar = this.add.rectangle(200, 100, 200, 20, 0x0ffffff).setDepth(10); 
    this.healthbar.scrollFactorX = 0;
    this.healthbar.scrollFactorY = 0;

    this.healthbarinside = this.add.rectangle(200, 100, 200, 20, 0x060f20c).setDepth(10);
    this.healthbarinside.scrollFactorX = 0;
    this.healthbarinside.scrollFactorY = 0;

    this.score = 0; //Pontuação inicial

    this.scoretext = this.add.text(window.innerWidth - 200, 100, "Pontuação: " + this.score, { fontFamily: "Arial", fontSize: 30 }).setDepth(10);
    this.scoretext.scrollFactorX = 0;
    this.scoretext.scrollFactorY = 0;

    this.ammo = 20; //Quantidade de munição
    this.ammotext = this.add.text(window.innerWidth - 200, 150, "Balas: " + this.ammo, { fontFamily: "Arial", fontSize: 30 }).setDepth(10);
    this.ammotext.scrollFactorX = 0;
    this.ammotext.scrollFactorY = 0;

    this.demontext = this.add.text(window.innerWidth - 200, 200, "Inimigos: 0", { fontFamily:"Arial", fontSize: 30 }).setDepth(10);
    this.demontext.scrollFactorX = 0;
    this.demontext.scrollFactorY = 0;

    this.addWeaponActions();

    var gameobject = this;
    this.healFunction = setInterval(function(){
      if(gameobject.health < 100){
        gameobject.health += 1;
        gameobject.updateHealthBar();
      }
    }, 1000);

    this.physics.add.collider(this.player, this.bags, (player, bag) => {
      this.collect(player, bag);
    });

    this.physics.add.collider(this.player, this.demons, (player, demon) => {
      this.loseHealth(player, demon);
    });

    this.physics.add.collider(this.demons, this.demons);
    
    this.physics.add.collider(this.bullets, this.demons, (bullet, demon) => {
      bullet.destroy();
      demon.destroy();
      /*
      this.clearTint();
      this.play("boom"); // Explosão
      */
      this.score += 1;
      this.scoretext.setText("Pontuação: " + this.score);
      this.demontext.setText("Inimigos: " + this.demons.children.entries.length);
    });
  }

  collect(player, bag){
    this.ammo += 2; //Aumentativo de balas
    this.ammotext.setText("Balas: " + this.ammo);
    bag.destroy();
    for(let i = 0; i < random(0, 2); i++){
      this.bags.create(random(bagsize / 2, size - bagsize / 2), random(bagsize / 2, size - bagsize / 2), "bag").setScale(0.75, 0.75);
    }
  }

  updateHealthBar(){
    if(this.health < 0) this.health = 0;
    this.healthbarinside.width = 200 * this.health / 100;
  }

  loseHealth(player, demon){
    demon.touchingplayer = true;
    if(demon.timeleft != 0) return;
    this.health -= 20;
    this.updateHealthBar();
    if(this.health <= 0){
      this.scene.start("diedscene");
      clearInterval(this.addDemonFunction);
    }
    demon.timeleft = 50;
  }

  addDemons(){
    this.demons = this.physics.add.group();
    this.addDemonFunction = setInterval(() => {
      let demon = this.demons.create(random(playersize / 2, size - playersize / 2), random(playersize / 2, size - playersize / 2), "inimigo").setScale(0.75, 0.75).setDepth(1);
      demon.timeleft = 0;
      demon.speed = random(200, speed); //Antigamente com velocidade de 100
      demon.touchingplayer = false;
      demon.setBounce(1, 1);
      this.demontext.setText("Inimigos: " + this.demons.children.entries.length)
    }, 1000); //Tempo de spawn
  }

  addWeaponActions(){
    this.useweapon = true;
    window.addEventListener("mousedown", e => {
      if(!this.useweapon) return;
      if(!this.ammo) return;
      var angle = Math.atan2(e.clientY - (window.innerHeight / 2), e.clientX - (window.innerWidth / 2));
      let bullet = this.bullets.create(this.player.body.position.x + playersize / 2 + Math.cos(angle) * playersize / 4, this.player.body.position.y + playersize / 2 + Math.sin(angle) * playersize / 4, "bullet").setScale(1, 0.2);
      bullet.angle = ((angle * 180 / Math.PI) + 360) % 360;
      bullet.setVelocityX(Math.cos(angle) * 1500);
      bullet.setVelocityY(Math.sin(angle) * 1500);
      this.pistol.angle = ((angle * 180 / Math.PI) + 360) % 360;
      this.pistol.angle2 = angle;
      this.useweapon = false;
      this.ammo--;
      this.ammotext.setText("Balas: " + this.ammo);
    });
    
    window.addEventListener("mousemove", e => {
      var angle = Math.atan2(e.clientY - (window.innerHeight / 2), e.clientX - (window.innerWidth / 2));
      this.pistol.angle = ((angle * 180 / Math.PI) + 360) % 360;
      this.pistol.angle2 = angle;
    });

    setInterval(() => {
      if(!this.useweapon){
        this.useweapon = true;
      }
    }, 500);
  }

  update() {
    let cursors = this.input.keyboard.createCursorKeys();
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    if(cursors.left.isDown || this.a.isDown){
      if(checkMovement("left", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityX(-speed);
    } if(cursors.right.isDown || this.d.isDown){
      if(checkMovement("right", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityX(speed);
    } if(cursors.up.isDown || this.w.isDown){
      if(checkMovement("up", this.player.body.position.x, this.player.body.position.y)) this.player.setVelocityY(-speed);
    } if(cursors.down.isDown || this.s.isDown){
      if(checkMovement("down", this.player.body.position.x, this.player.body.position.y))this.player.setVelocityY(speed);
    }
    this.pistol.body.position.x = this.player.body.position.x + (playersize / 4) * Math.cos(this.pistol.angle2) * 3 + 23;
    this.pistol.body.position.y = this.player.body.position.y + (playersize / 4) * Math.sin(this.pistol.angle2) * 3 + 30;

    this.player.angle = this.pistol.angle;

    for(let demon of this.demons.children.entries){
      if(demon.timeleft != 0){
        demon.timeleft -= 1;
      }
      if(demon.touchingplayer){
        demon.touchingplayer = false;
        var prevent = true;
        if(checkMovement("left", this.player.body.position.x, this.player.body.position.y) && checkMovement("right", this.player.body.position.x, this.player.body.position.y) && checkMovement("up", this.player.body.position.x, this.player.body.position.y) && checkMovement("down", this.player.body.position.x, this.player.body.position.y)){
          prevent = false;
        }
        if(prevent) return;
      }
      let angle = Math.atan2(this.player.body.position.y - demon.body.position.y, this.player.body.position.x - demon.body.position.x);
      demon.setVelocityX(Math.cos(angle) * demon.speed);
      demon.setVelocityY(Math.sin(angle) * demon.speed);
      demon.angle = ((angle * 180 / Math.PI) + 360) % 360 + 90;
      demon.touchingplayer = false;
    }
  }
}


export default gamescene;
import { size, playersize, ammosize, ratio, random, checkMovement } from "./functions.js";
const speed = 300;

class gamescene extends Phaser.Scene {
  constructor(){
    super();
}
  
  preload() {
    // Imagens
    this.load.image("jogador", "assets/nave.png");
    this.load.image("inimigo", "assets/inimigo.png");
    this.load.image("munição", "assets/projétil.png");
    this.load.image("universo", "assets/mapa.png");
    this.load.image("projétil", "assets/projétil.png");
    this.load.image("mira", "assets/mira.png");
    this.load.spritesheet("explosão", "assets/explosão.png",{frameWidth:32, frameHeight:32});

    // Sons
    this.load.audio("boom", ["sounds/boom.wav"]);
    this.load.audio("collectSound", ["sounds/collect.wav"]);
    this.load.audio("ost1", ["sounds/jogo.mp3"]);
}

  create() {
      
    // Configurações de sons
    var boom = this.sound.add("boom", { loop: false });
    var collectSound = this.sound.add("collectSound", { loop: false });
    var ost1 = this.sound.add("ost1", { loop: true });

    //Volumes
    boom.setVolume(0.080);
    collectSound.setVolume(0.070);
    ost1.setVolume(0.100);

    //Play
    ost1.play();

    //Teclado
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)


    // Criação do mapa
    for(let i = size / (ratio * 2); i < size; i += size / ratio){
      for(let j = size / (ratio * 2); j < size; j += size / ratio){
        let universo = this.physics.add.image(i, j, "universo").setDepth(0);
      }
    }

    //Animação de explosão
    this.anims.create({
      key:"blast",
      frames:this.anims.generateFrameNumbers("explosão"),
      frameRate:10,
      repeat:0
    });
      
    // Spawn de munição
    this.ammos = this.physics.add.group();
    for(let i = 0; i < random(30, 50); i++){
      this.ammos.create(random(ammosize / 2, size - ammosize / 2), random(ammosize / 2, size - ammosize / 2), "munição").setScale(0.75, 0.75);
    }
      
    // Nascimento do player
    this.player = this.physics.add.sprite(1500, 1500, "jogador").setScale(0.75, 0.75).setDepth(1);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, size, size);
    this.player.setCollideWorldBounds(true);


    this.pistol = this.physics.add.sprite(this.player.x, this.player.y, "mira").setDepth(2).setScale(0, 0); //Mudança que deixa a arma invisível

    this.pistol.angle2 = 0;

    this.addEnemys();
    this.bullets = this.physics.add.group();
    this.physics.world.setFPS(120);


    this.health = 100; //Vida atual do player
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
    this.best = localStorage.getItem("best"); // Recorde

    //Interface lateral
    this.scoretext = this.add.text(window.innerWidth - 215, 50, "Pontuação: " + this.score, { fontFamily: "Arial", fontSize: 30 }).setDepth(10);
    this.scoretext.scrollFactorX = 0;
    this.scoretext.scrollFactorY = 0;

    this.ammo = 20; //Quantidade de munição
    this.ammotext = this.add.text(window.innerWidth - 215, 100, "Munição: " + this.ammo, { fontFamily: "Arial", fontSize: 30 }).setDepth(10);
    this.ammotext.scrollFactorX = 0;
    this.ammotext.scrollFactorY = 0;

    this.enemytext = this.add.text(window.innerWidth - 215, 150, "Inimigos: 0", { fontFamily:"Arial", fontSize: 30 }).setDepth(10);
    this.enemytext.scrollFactorX = 0;
    this.enemytext.scrollFactorY = 0;

    this.addWeaponActions();

    var gameobject = this;
    this.healFunction = setInterval(function(){
      if(gameobject.health < 100){
        gameobject.health += 2 //Taxa de recuperação
        gameobject.updateHealthBar();
      }
    }, 1000);

    this.physics.add.collider(this.player, this.ammos, (player, ammo) => {
      this.collect(player, ammo);
      collectSound.play();
    });

    this.physics.add.collider(this.player, this.enemys, (player, enemy) => {
      this.loseHealth(player, enemy);
      if (this.health == 0){
          ost1.stop();
      }
    });

    this.physics.add.collider(this.enemys, this.enemys);
    
    this.physics.add.collider(this.bullets, this.enemys, (bullet, enemy) => {
      bullet.destroy();
      enemy.destroy();
      this.explosion(enemy);
      boom.play();
      this.score += 1; // Aumentativo de pontos
      this.scoretext.setText("Pontuação: " + this.score);
      this.enemytext.setText("Inimigos: " + this.enemys.children.entries.length);
      if (this.score == 250){
          this.victory();
          ost1.stop();
      }
    });
}

  explosion (enemy){
    var explosion = this.physics.add.sprite(enemy.x , enemy.y ).setScale(2).anims.play("blast");
}

  collect(player, ammo){
    this.ammo += 1; //Aumentativo da munição
    this.ammotext.setText("Munição: " + this.ammo);
    ammo.destroy();
    for(let i = 0; i < random(0, 2); i++){
      this.ammos.create(random(ammosize / 2, size - ammosize / 2), random(ammosize / 2, size - ammosize / 2), "munição").setScale(0.75, 0.75);
    }
  }

  updateHealthBar(){
    if(this.health < 0) this.health = 0;
    this.healthbarinside.width = 200 * this.health / 100;
  }

  loseHealth(player, enemy){
    enemy.touchingplayer = true;
    if(enemy.timeleft != 0) return;
    this.health -= 20;
    this.updateHealthBar();
    if(this.health <= 0){
      if (this.score > this.best) {
        localStorage.setItem ("best", this.score); // Salva o recorde
        this.best = this.score;
      }
      localStorage.setItem("score", this.score); //Salva a pontuação
      this.scene.start("diedscene");
      clearInterval(this.addEnemyFunction);
    }
    enemy.timeleft = 50;
  }

  addEnemys(){
    this.enemys = this.physics.add.group();
    this.addEnemyFunction = setInterval(() => {
      let enemy = this.enemys.create(random(playersize / 2, size - playersize / 2), random(playersize / 2, size - playersize / 2), "inimigo").setScale(0.75, 0.75).setDepth(1);
      enemy.timeleft = 0;
      enemy.speed = random(220, speed); //Antigamente com velocidade de 100
      enemy.touchingplayer = false;
      enemy.setBounce(1, 1);
      this.enemytext.setText("Inimigos: " + this.enemys.children.entries.length)
    }, 1200); //Tempo de spawn (1.2 segundo)
  }

  addWeaponActions(){
    this.useweapon = true;
    window.addEventListener("mousedown", e => {
      if(!this.useweapon) return;
      if(!this.ammo) return;
      var angle = Math.atan2(e.clientY - (window.innerHeight / 2), e.clientX - (window.innerWidth / 2));
      let bullet = this.bullets.create(this.player.body.position.x + playersize / 2 + Math.cos(angle) * playersize / 4, this.player.body.position.y + playersize / 2 + Math.sin(angle) * playersize / 4, "projétil").setScale(1, 0.2);
      bullet.angle = ((angle * 180 / Math.PI) + 360) % 360;
      bullet.setVelocityX(Math.cos(angle) * 1500);
      bullet.setVelocityY(Math.sin(angle) * 1500);
      this.pistol.angle = ((angle * 180 / Math.PI) + 360) % 360;
      this.pistol.angle2 = angle;
      this.useweapon = false;
      this.ammo--;
      this.ammotext.setText("Munição: " + this.ammo);
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

  victory(){
      this.scene.start("victoryscreen");
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

    for(let enemy of this.enemys.children.entries){
      if(enemy.timeleft != 0){
        enemy.timeleft -= 1;
      }
      if(enemy.touchingplayer){
        enemy.touchingplayer = false;
        var prevent = true;
        if(checkMovement("left", this.player.body.position.x, this.player.body.position.y) && checkMovement("right", this.player.body.position.x, this.player.body.position.y) && checkMovement("up", this.player.body.position.x, this.player.body.position.y) && checkMovement("down", this.player.body.position.x, this.player.body.position.y)){
          prevent = false;
        }
        if(prevent) return;
      }
      let angle = Math.atan2(this.player.body.position.y - enemy.body.position.y, this.player.body.position.x - enemy.body.position.x);
      enemy.setVelocityX(Math.cos(angle) * enemy.speed);
      enemy.setVelocityY(Math.sin(angle) * enemy.speed);
      enemy.angle = ((angle * 180 / Math.PI) + 360) % 360 + 90;
      enemy.touchingplayer = false;
    }
  }
}


export default gamescene;
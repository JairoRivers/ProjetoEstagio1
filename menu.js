import { width, height } from "./functions.js";

class menu extends Phaser.Scene {
  constructor(){
    super();
  }
  
  preload(){
     this.load.image("menu", "assets/menu.png");
     this.load.audio("login screen", ["sounds/arcade.mp3"]);
     this.load.audio("click", ["sounds/click.wav"]);
  }
  
  create(){
    this.add.image(600, 300, "menu");

    //Música do menu
    var login = this.sound.add("login screen", { loop: true });
    login.play();
    login.setVolume(0); //Por enquanto manter no modo mudo

    //Som do clique
    var click = this.sound.add("click", {lopp: false});
    click.setVolume(0.040);
      
    this.add.text(window.innerWidth / 2, 100, "Space Score", { fontFamily: "Times New Romam", fontSize:100 }).setOrigin(0.5);

    this.button = this.add.rectangle(0, 0, 0, 0, 0x000080); //cor 0x + código de cor
    this.text = this.add.text(window.innerWidth / 2, window.innerHeight / 2.5, 'Iniciar', { fill: '#ffffff', fontFamily: "Arial", fontSize:50 }).setOrigin(0.5);
    this.button.width = this.text.width + 15;
    this.button.height = this.text.height + 15;
    this.button.x = this.text.x - (this.text.width / 2) - 5;
    this.button.y = this.text.y - (this.text.height / 2) - 5;
    this.button.setInteractive();
    this.button.on('pointerover', () => { this.text.setStyle({ fill: 'yellow'})});
    this.button.on('pointerout', () => { this.text.setStyle({ fill: 'white'})});
    this.button.on('pointerdown', () => {
      click.play();
      login.stop();
      this.scene.start("gamescene");
    });

    this.button2 = this.add.rectangle(0, 0, 0, 0, 0x000080); //cor 0x + código de cor
    this.text2 = this.add.text(window.innerWidth / 2, window.innerHeight / 1.8, 'Como jogar', { fill: '#ffffff', fontFamily: "Arial", fontSize:50 }).setOrigin(0.5);
    this.button2.width = this.text2.width + 15;
    this.button2.height = this.text2.height + 15;
    this.button2.x = this.text2.x - (this.text2.width / 2) - 5;
    this.button2.y = this.text2.y - (this.text2.height / 2) - 5;
    this.button2.setInteractive();
    this.button2.on('pointerover', () => { this.text2.setStyle({ fill: 'yellow'})});
    this.button2.on('pointerout', () => { this.text2.setStyle({ fill: 'white'})});
    this.button2.on('pointerdown', () => {
      click.play();
      login.stop();
      this.scene.start("tutorial");
    });

  }
  
  update(){

  }
}

export default menu;
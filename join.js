import { width, height } from "./functions.js";

class joinscene extends Phaser.Scene {
  constructor(){
    super();
  }
  
  preload(){
     this.load.image("menu", "assets/menu.png");
     this.load.audio("login screen", ["sounds/menu_Arcade.mp3"]);
     this.load.audio("click", ["sounds/click.wav"]);


  }
  
  create(){
    this.add.image(600, 300, "menu");

    //Adição da música do menu
    var login = this.sound.add("login screen", { loop: true });
    login.play();
    login.setVolume(0.015);

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
    this.button.setInteractive().on('pointerdown', () => {
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
    this.button2.setInteractive().on('pointerdown', () => {
      click.play();
      login.stop();
      this.scene.start("howtoplay");
    });

  }
  
  update(){

  }
}

export default joinscene;
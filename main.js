import gamescene from "./game.js";
import menuscene from "./menu.js";
import tutorial from "./tutorial.js";
import diedscene from "./died.js";

import { width, height } from "./functions.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

game.scene.add("gamescene", gamescene);
game.scene.add("menuscene", menuscene);
game.scene.add("tutorial", tutorial)
game.scene.add("diedscene", diedscene);
game.scene.start("menuscene");

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
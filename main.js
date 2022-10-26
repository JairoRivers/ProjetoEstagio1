import gamescene from "./game.js";
import joinscene from "./join.js";
import howtoplay from "./howtoplay.js";
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
game.scene.add("joinscene", joinscene);
game.scene.add("howtoplay", howtoplay)
game.scene.add("diedscene", diedscene);
game.scene.start("joinscene");

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
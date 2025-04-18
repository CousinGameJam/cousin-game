import Example from './example-scene.js'
import TilemapDemo from './src/game/scenes/tilemap-demo-scene.js'
import StoryDemo from "./src/game/scenes/story-demo-scene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
        TilemapDemo,
        Example,
        StoryDemo
    ],
    antialias: false,
    pixelArt: true,
    roundPixels: true, // Helps reduce sub-pixel blurring/gaps
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);

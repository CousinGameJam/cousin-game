import Example from './example-scene.js'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    }
};

const game = new Phaser.Game(config);

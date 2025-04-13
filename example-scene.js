class Example extends Phaser.Scene {
    score = 0;
    scoreText;

    preload() {
        this.load.image('confused', 'assets/confused.png');
    }

    create() {
        this.add.image(400, 300, 'confused');


        const img = this.physics.add.image(400, 100, 'confused');

        img.setVelocity(300, 200);
        img.setBounce(1, 1);
        img.setCollideWorldBounds(true);

        this.scoreText = this.add.text(40, 30, 'score: 0', {fontSize: '32px', fill: '#fff'});
    }

    update() {

    }

}

export default Example
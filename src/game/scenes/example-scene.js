class Example extends Phaser.Scene {

    constructor() {
        super('Example');

        this.score = 0;
        this.scoreText;
        this.player;
        this.movementSpeed = 300;
        this.cursors;
        this.stars;
        this.isGameOver = false;
        this.winText;
        this.loseText;
    }

    preload() {
        this.load.image('confused', 'assets/confused.png');
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('star', 'assets/star.png');
    }

    create() {
        // Create player and position it in the top-middle of the screen
        this.player = this.physics.add.image(this.game.config.width / 2, 100, 'confused');
        this.player.body.setAllowGravity(false);
        this.player.setCollideWorldBounds(true);

        // Create a bouncy bomb
        const bouncyBomb = this.physics.add.image(100, 100, 'bomb').setScale(5).refreshBody();
        bouncyBomb.setVelocity(300, 200);
        bouncyBomb.setBounce(1, 1);
        bouncyBomb.setCollideWorldBounds(true);

        // Generate stars and call collectStar when player overlaps with any star
        this.generateStars(12);

        // Refer to https://docs.phaser.io/api-documentation/class/physics-arcade-arcadephysics#overlap
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, bouncyBomb, this.onPlayerAndBombCollision, null, this);

        // Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add texts
        // TODO: Center-align winText and loseText properly
        this.scoreText = this.add.text(40, 30, 'score: 0', { fontSize: '32px', fill: '#fff' });

        this.winText = this.add.text(this.game.config.width / 4, this.game.config.height / 2 - 32, 
            "YOU WIN!", { fontSize: '64px', fill: '#008000' });
        this.winText.setVisible(false);

        this.loseText = this.add.text(this.game.config.width / 4, this.game.config.height / 2 - 32, 
            "YOU LOSE!", { fontSize: '64px', fill: '#ff0000' });
        this.loseText.setVisible(false);




        this.add.text(40, 500, 'N - tile map demo', {fontSize: '32px', fill: '#fff'})
            .setInteractive({useHandCursor: true})
            .on('pointerup', () => {
                this.scene.start('TilemapDemo');
            });

        this.add.text(40, 540, 'M - story demo', {fontSize: '32px', fill: '#fff'})
            .setInteractive({useHandCursor: true})
            .on('pointerup', () => {
                this.scene.start('StoryDemo');
            });

        // Update method will handle the key press
        this.input.keyboard.on('keydown-N', () => {
            console.log("[Example] Switching to TilemapDemo scene");
            this.scene.start('TilemapDemo');
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start('StoryDemo');
        });
    }

    update() {
        if (this.isGameOver)
        {
            return;
        }

        // Player movement
        if (this.cursors.left.isDown)
        {
            this.player.setVelocity(-this.movementSpeed, 0);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocity(this.movementSpeed, 0);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocity(0, -this.movementSpeed);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocity(0, this.movementSpeed);
        }
        else 
        {
            this.player.setVelocity(0, 0);
        }
    }

    collectStar(player, star) {
        // Disable and hide star
        star.disableBody(true, true);

        // Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // TODO: Display win text in a dialogue box instead of raw text
        if (this.stars.countActive(true) === 0)
        {
            this.physics.pause();
            player.setTint(0x008000);  
            this.winText.setVisible(true);
        }
    }

    // Creates stars at random positions within the scene
    generateStars(numStars) {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: numStars - 1,
            setXY: { x: 60, y: 60 }
        })

        this.stars.children.iterate((child) => {
            child.body.setAllowGravity(false);
            child.x += Phaser.Math.Between(0, this.game.config.width - child.body.width);
            child.y += Phaser.Math.Between(0, this.game.config.height - child.body.height);
        });
    }

    onPlayerAndBombCollision(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000); 

        // TODO: Display lose text in a dialog box instead of raw text
        this.loseText.setVisible(true);

        this.gameOver = true;
    }
}

export default Example
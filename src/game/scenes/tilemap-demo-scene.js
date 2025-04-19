import Player from "../characters/player.js";
import Baba from "../characters/baba.js";
import createStory from "../util/story-player.js";

class TilemapDemo extends Phaser.Scene {
    logStatus;

    constructor() {
        super('TilemapDemo');
        this.logStatus = true;
    }

    preload() {
        this.load.image('forest-image', 'assets/Tiles/Tileset1xPadding.png');
        this.load.image('decoration-image', 'assets/Tiles/Decorations/Decorations.png'); // Make sure this is the correct image file

        this.load.tilemapTiledJSON('map', 'assets/Tiles/intro-forest-map.json');

        Baba.preload(this)
        Player.preload(this)
    }

    create() {
        this.createMap();
        this.setupCharacters();
        this.setupCamera();
        this.setupStory();
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupStory() {
        this.story = createStory(this,
            this.scene.get('UI'), {
            LG: {
                character: this.player,
                color: "#a33",
            },
            BY: {
                character: this.baba1,
                color: "#3a3",
            }
        });
    }

    setupCharacters() {
        this.player = Player.create(this, 200, 500)
        this.baba = Baba.create(this, 880, 220)
        this.baba1 = Baba.create(this, 280, 500)
        this.physics.add.collider(this.player, this.baba1, this.talkToBaba, null, this);
    }


    talkToBaba = () => {
        console.log("talk baba")
        // TODO disable cursors / input when interacting so the interaction does not start multiple times
        this.story.talkTo("baba")
    }

    setupCamera() {
        const camera = this.cameras.main;
        camera.zoom = 2
        camera.roundPixels = this.game.config.roundPixels;
        camera.scrollX = -130
        camera.scrollY = 200

        camera.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        camera.startFollow(this.player, this.game.config.roundPixels, 0.05, 0.1, -40, 30);
    }

    createMap() {
        const camera = this.cameras.main;

        this.map = this.make.tilemap({key: 'map'});
        const decorationTileset = this.map.addTilesetImage('Decoration', 'decoration-image');
        const forestTileset = this.map.addTilesetImage('Forest', 'forest-image', 16, 16, 1, 1);
        if ([forestTileset, decorationTileset].every((tileset) => tileset !== null)) {
            console.log('[TilemapDemo] Tileset layers being created');
            const bgLayer = this.map.createLayer('bg', forestTileset, 0, 0);
            const groundLayer = this.map.createLayer('Ground', forestTileset, 0, 0);
            const wallsLayer = this.map.createLayer('walls', forestTileset, 0, 0);
            const collectable = this.map.createLayer('collectable', decorationTileset, 0, 0);
            const decorationLayer = this.map.createLayer('Decoration', decorationTileset, 0, 0);
            const decoration1Layer = this.map.createLayer('Decoration1', decorationTileset, 0, 0);
            // decorationLayer.setCollisionByProperty({ collides: true })
        } else {
            if (this.logStatus) {
                console.log('[TilemapDemo] Ground: Tileset not found');
            }
        }

        // Click-drag
        let cameraDragStartX;
        let cameraDragStartY;
        this.input.on('pointerdown', () => {
            cameraDragStartX = camera.scrollX;
            cameraDragStartY = camera.scrollY;
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                camera.scrollX = cameraDragStartX + (pointer.downX - pointer.x) / camera.zoom;
                camera.scrollY = cameraDragStartY + (pointer.downY - pointer.y) / camera.zoom;
            }
        });

        // Scroll zoom in/out
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Get the current world point under pointer.
            const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            const newZoom = camera.zoom - camera.zoom * 0.001 * deltaY;
            camera.zoom = Phaser.Math.Clamp(newZoom, 0.25, 4);

            // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
            camera.preRender();
            const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            // Scroll the camera to keep the pointer under the same world point.
            camera.scrollX -= newWorldPoint.x - worldPoint.x;
            camera.scrollY -= newWorldPoint.y - worldPoint.y;
        });

    }

    update() {
        Player.update(this.player, this.cursors)
    }

}

export default TilemapDemo;
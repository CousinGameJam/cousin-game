
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
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const decorationTileset = map.addTilesetImage('Decoration', 'decoration-image');
        const forestTileset = map.addTilesetImage('Forest', 'forest-image', 16, 16, 1, 1);
        if ([forestTileset, decorationTileset].every( (tileset) => tileset !== null)) {
            console.log('[TilemapDemo] Tileset layers being created');
            const bgLayer = map.createLayer('bg', forestTileset, 0, 0);
            const groundLayer = map.createLayer('Ground', forestTileset, 0, 0);
            const wallsLayer = map.createLayer('walls', forestTileset, 0, 0);
            const collectable = map.createLayer('collectable', decorationTileset, 0, 0);
            const decorationLayer = map.createLayer('Decoration', decorationTileset, 0, 0);
            const decoration1Layer = map.createLayer('Decoration1', decorationTileset, 0, 0);
            // decorationLayer.setCollisionByProperty({ collides: true })
        } else {
            if (this.logStatus) {
                console.log('[TilemapDemo] Ground: Tileset not found');
            }
        }

        // Camera Controls 
        const camera = this.cameras.main;
        camera.zoom=3
        camera.roundPixels = true;
        camera.scrollX = -130
        camera.scrollY = 200
        
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

    changeScene() {
        this.scene.start('MainMenu');
    }
}

export default TilemapDemo;
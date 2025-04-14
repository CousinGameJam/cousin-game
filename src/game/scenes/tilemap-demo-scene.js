
class TilemapDemo extends Phaser.Scene {
    logStatus;

    constructor() {
        super('TilemapDemo');
        this.logStatus = false;
    }

    preload() {
        this.load.image('tiles', 'assets/Tiles/Tileset1xPadding.png');
        this.load.tilemapTiledJSON('map', 'assets/Tiles/TestForest.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('TestForest', 'tiles');
        if (tileset) {
            map.createLayer('Ground', tileset, 0, 0);
        } else {
            if (this.logStatus) {
                console.log('[TilemapDemo] Ground: Tileset not found');
            }
        }

        // Camera Controls 
        const camera = this.cameras.main;

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
            camera.zoom = Phaser.Math.Clamp(newZoom, 0.25, 2);

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
const movementSpeed = 180

const preload = scene => {
    scene.load.spritesheet('player', 'assets/sprites/dante_1.png', {frameWidth: 48, frameHeight: 48});
};

const create = (scene, x, y) => {
    const sprite = scene.physics.add.sprite(x, y, 'player')
    sprite.setScale(2)
    createAnimations(scene)
    return sprite;
};


const update = (sprite, cursors) => {
    sprite.body.setVelocity(0, 0)

    if (cursors.left.isDown) sprite.body.setVelocityX(-movementSpeed)
    if (cursors.right.isDown) sprite.body.setVelocityX(movementSpeed);
    if (cursors.up.isDown) sprite.body.setVelocityY(-movementSpeed)
    if (cursors.down.isDown) sprite.body.setVelocityY(movementSpeed)

    if (sprite.body.velocity.x !== 0) {
        sprite.anims.play(sprite.body.velocity.x > 0 ? 'walkRight' : 'walkLeft', true);
    } else if (sprite.body.velocity.y !== 0) {
        sprite.anims.play(sprite.body.velocity.y > 0 ? 'walkDown' : 'walkUp', true);
    } else {
        sprite.anims.stop();
    }
};

const createAnimations = (scene) => {
    if (scene.anims.exists('walkDown')) return;

    scene.anims.create({
        key: 'walkDown',
        frames: scene.anims.generateFrameNumbers('player', {frames: [0, 4, 8, 12]}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'walkLeft',
        frames: scene.anims.generateFrameNumbers('player', {frames: [1, 5, 9, 13]}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'walkUp',
        frames: scene.anims.generateFrameNumbers('player', {frames: [2, 6, 10, 14]}),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'walkRight',
        frames: scene.anims.generateFrameNumbers('player', {frames: [3, 7, 11, 15]}),
        frameRate: 8,
        repeat: -1
    });
}


export default {
    preload: preload,
    create: create,
    update: update
}
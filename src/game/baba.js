const create = (scene, x, y) => {
    const sprite = scene.physics.add.staticSprite(x, y, 'baba')
    createAnimations(scene)
    sprite.anims.play('idle', true);
    sprite.setScale(2)
    return sprite;
};

const preload = scene => {
    scene.load.spritesheet('baba', 'assets/sprites/billy_idle.png', {frameWidth: 32, frameHeight: 32});
};

const createAnimations = (scene) => {
    if (scene.anims.exists('idle')) return;

    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('baba', {start: 0, end: 5}),
        frameRate: 6,
        repeat: -1
    });
}

export default {
    preload: preload,
    create: create
}

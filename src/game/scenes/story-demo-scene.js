import Player from "../characters/player.js";
import Baba from "../characters/baba.js";
import createStory from "../util/story-player.js";

class StoryDemo extends Phaser.Scene {
    story;

    constructor() {
        super('StoryDemo');
    }

    preload() {
        Baba.preload(this)
        Player.preload(this)
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.baba = Baba.create(this, 400, 200)
        this.player = Player.create(this, 100, 100)
        this.physics.add.collider(this.player, this.baba, this.talkToBaba, null, this);

        this.story = createStory(this)
    }

    update() {
        Player.update(this.player, this.cursors)
    }


    talkToBaba = () => {
        // TODO disable cursors / input when interacting so the interaction does not start multiple times
        this.story.talkTo("baba")
    }
}

export default StoryDemo;
class StoryDemo extends Phaser.Scene {
    story;
    currentText;
    buttons = []
    continueButton;
    characterColors = {"LG": "#a33", "BY": "#3a3"}
    defaultTextColor = "#fff"

    constructor() {
        super('StoryDemo');
    }

    preload() {
    }

    create() {
        this.story = new inkjs.Story(window.storyContent);

        this.continueButton = this.createContinueButton();
        this.currentText = this.add.text(20, 20, "", {}); // TODO word wrap

        this.continueStory()
    }

    update() {
    }

    continueStory() {
        let storyText = this.story.Continue();
        this.currentText
            .setText(this.getText(storyText))
            .setColor(this.getColor(storyText));
        this.buttons.forEach(button => button.destroy())
        this.buttons = this.story.currentChoices.map(choice => this.createButton(choice))
        this.continueButton.setVisible(this.story.canContinue)
    }

    createButton(choice) {
        return this.add.text(40, choice.index * 40 + 200, this.getText(choice.text), {fill: this.getColor(choice.text)})
            .setPadding(10)
            .setInteractive({useHandCursor: true})
            .on('pointerup', () => {
                this.story.ChooseChoiceIndex(choice.index);
                this.continueStory()
            })
    }

    createContinueButton() {
        return this.add.text(300, 400, "-->", {})
            .setPadding(10)
            .setInteractive({useHandCursor: true})
            .on('pointerup', () => {
                this.continueStory()
            });
    }

    getColor(text) {
        return this.characterColors[this.getCharacter(text)] || this.defaultTextColor;
    }

    getCharacter(text) {
        const match = this.matchCharacterPrefix(text);
        return match ? match[1] : null;
    }

    getText(text) {
        const match = this.matchCharacterPrefix(text)
        return match ? match[2] : text;
    }

    matchCharacterPrefix(text) {
        // e.g. "LG: Hello", means the character Little Girl (LG) saying "Hello"
        return text.match(/^\s*([A-Z]{1,5})\s*:\s*(.*)/);
    }
}

export default StoryDemo;
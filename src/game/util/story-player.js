export default (uiScene) => {
    const characterColors = {"LG": "#a33", "BY": "#3a3"}
    const defaultTextColor = "#fff"

    const getColor = (text) => {
        return characterColors[getCharacter(text)] || defaultTextColor;
    }

    const getCharacter = (text) => {
        const match = matchCharacterPrefix(text);
        return match ? match[1] : null;
    }

    const getText = (text) => {
        const match = matchCharacterPrefix(text)
        return (match ? match[2] : text).trim();
    }

    const matchCharacterPrefix = (text) => {
        // e.g. "LG: Hello", means the character Little Girl (LG) saying "Hello"
        return text.match(/^\s*([A-Z]{1,5})\s*:\s*(.*)/);
    }


    const continueStory = () => {
        let storyText = story.Continue();
        currentText
            .setText(getText(storyText))
            .setColor(getColor(storyText));
        buttons.forEach(button => button.destroy())
        buttons = story.currentChoices.map(choice => createButton(choice))
        continueButton.setVisible(story.canContinue)
    }

    const createButton = (choice) => {
        const x = 40
        const y = choice.index * 40 + 200
        return uiScene.add.text(x, y, getText(choice.text), {
            fill: getColor(choice.text),
            backgroundColor: '#222222'
        })
            .setPadding(10)
            .setInteractive({useHandCursor: true})
            .on('pointerup', () => {
                story.ChooseChoiceIndex(choice.index);
                continueStory()
            })
    }

    const createContinueButton = () => {
        return uiScene.add.text(666, 500, "-->", {backgroundColor: '#222222'})
            .setPadding(30)
            .setInteractive({useHandCursor: true})
            .on('pointerup', continueStory);
    }

    // inkjs loaded in index.html
    // storyContent from story.js in index.html 
    const story = new inkjs.Story(window.storyContent);

    let buttons = []
    const continueButton = createContinueButton();
    const currentText = uiScene.add.text(20, 20, "", {backgroundColor: '#222222'})
        .setPadding(10); // TODO word wrap


    const talkTo = (name) => {
        story.ChoosePathString(name);
        continueStory()
    };

    return {
        story: story,
        talkTo: talkTo
    }
}

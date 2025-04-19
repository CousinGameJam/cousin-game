export default (characterScene, uiScene, characterConfigs) => {
    const defaultTextColor = "#fff"

    function getCharacterConfig(line) {
        return characterConfigs[getCharacterCode(line)];
    }

    const getColor = (line) => {
        return getCharacterConfig(line)?.color ?? defaultTextColor;
    }

    const getCharacterCode = (line) => {
        const match = matchCharacterPrefix(line);
        return match ? match[1] : null;
    }

    const getText = (line) => {
        const match = matchCharacterPrefix(line)
        return (match ? match[2] : line).trim();
    }

    const matchCharacterPrefix = (text) => {
        // e.g. "LG: Hello", means the character Little Girl (LG) saying "Hello"
        return text.match(/^\s*([A-Z]{1,5})\s*:\s*(.*)/);
    }


    const continueStory = () => {
        continueButton.setVisible(false);
        storyText.setVisible(false)
        Object.values(characterTexts).forEach(characterText => characterText.setVisible(false));
        if (!story.canContinue) return;
        
        let line = story.Continue();
        const currentText = characterTexts[getCharacterCode(line)] ?? storyText;
        
        currentText
            .setVisible(true)
            .setText(getText(line))
        ;
        const pos = characterConfigs[getCharacterCode(line)]?.character
        currentText.x = pos?.x ?? 0
        currentText.y = pos?.y ?? 0
        
        buttons.forEach(button => button.destroy())
        buttons = story.currentChoices.map(choice => createButton(choice))
        continueButton.setVisible(buttons.length === 0)
    }

    const createButton = (choice) => {
        const x = 40
        const y = choice.index * 40 + 470
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
            .setVisible(false)
            .on('pointerup', continueStory);
    }

    const createCharacterText = (characterCode) => {
        return characterScene.add.text(0, 0, "", {backgroundColor: '#222222'})
            .setFontSize(8) // FIXME blurry, do not apply zoom here
            .setVisible(false)
            .setColor(characterConfigs[characterCode]?.color ?? defaultTextColor)
            .setPadding(10)
            .setOrigin(0.5, 2) // display in the middle above the character
    // TODO word wrap
    }

    // inkjs loaded in index.html
    // storyContent from story.js in index.html 
    const story = new inkjs.Story(window.storyContent);

    let buttons = []
    const continueButton = createContinueButton();
    const storyText = uiScene.add.text(0, 0, "", {backgroundColor: '#555'})
        .setVisible(false)
        .setColor(defaultTextColor)
        .setPadding(10)
    // TODO word wrap
    
    const characterTexts={}
    Object.keys(characterConfigs).forEach(characterCode=> {
            characterTexts[characterCode] = createCharacterText(characterCode)
        }
    );

    const talkTo = (name) => {
        story.ChoosePathString(name);
        continueStory()
    };

    return {
        story: story,
        talkTo: talkTo
    }
}

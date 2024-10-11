import './EmotionsMenu.css';

export interface EmotionsMenuProps {
  parent: HTMLDivElement;
}

class EmotionsMenu {

  buttonData: { [key: string]: HTMLLIElement };
  buttonList: HTMLUListElement;
  clickEmotionCB: (emotion: string) => void;
  container: HTMLDivElement;
  emotions: { [key: string]: any };
  menuLabel: HTMLParagraphElement;
  menuList: HTMLUListElement;
  parent: HTMLDivElement;

  constructor(props: EmotionsMenuProps) {

    this.parent = props.parent;

    this.container = document.createElement('div');
    this.container.id = "menuEmotions";
    this.container.className = "menuContainer";

    this.menuList = document.createElement('ul');
    this.menuList.className = "menuList";

    const menuLILabel = document.createElement('li');
    this.menuList.appendChild(menuLILabel);

    this.menuLabel = document.createElement('p');
    this.menuLabel.className = "menuLabel";
    this.menuLabel.innerHTML = "Emotions Menu";

    menuLILabel.appendChild(this.menuLabel);

    const menuLIButtonList = document.createElement('li');
    this.menuList.appendChild(menuLIButtonList);

    this.buttonList = document.createElement('ul');
    this.buttonList.className = "menuListButton";

    menuLIButtonList.appendChild(this.buttonList);

    this.emotions = {};
    this.buttonData = {};

    this.container.appendChild(this.menuList);

    this.onClickEmotion = this.onClickEmotion.bind(this);

    this.clickEmotionCB = (emotion: string) => {};

  }

  resetButtons() {
    Object.keys(this.buttonData).forEach((animation: string) => {
      (this.buttonData[animation].firstChild as HTMLButtonElement).removeEventListener("click", this.onClickEmotion);
      this.buttonList.removeChild(this.buttonData[animation]);
      delete this.buttonData[animation];
    });
  }

  setData(data: any) {
    if (data.onClickEmotion && this.clickEmotionCB !== data.onClickEmotion) 
      this.clickEmotionCB = data.onClickEmotion;

    if (!!data.emotionOptions) {
      this.emotions = data.emotionOptions;
      this.updateEmotionButtons();
    }
  }

  updateEmotionButtons() {
    this.resetButtons();
    this.emotions.forEach((emotion: string) => {
      this.buttonData[emotion] = document.createElement('li');
      const button: HTMLButtonElement = document.createElement('button');
      button.innerText = emotion;
      button.value = emotion;
      button.addEventListener("click", this.onClickEmotion);
      this.buttonData[emotion].appendChild(button);
      this.buttonList.appendChild(this.buttonData[emotion]);
    });
  }

  onClickEmotion(evt: MouseEvent) {
    console.log('EmotionsMenu onClickEmotion', (evt.currentTarget as HTMLButtonElement).value);
    this.clickEmotionCB((evt.currentTarget as HTMLButtonElement).value);
  }

}

export default EmotionsMenu

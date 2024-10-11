import './AnimationsMenu.css';

export interface AnimationsMenuProps {
  parent: HTMLDivElement;
}

class AnimationsMenu {

  animations: { [key: string]: any };
  buttonData: { [key: string]: HTMLLIElement };
  buttonList: HTMLUListElement;
  changeEmotionCB: (emotion: string) => void;
  clickAnimationCB: (animation: string) => void;
  container: HTMLDivElement;
  emotionSelect: HTMLSelectElement;
  emotionSelectData: { [key: string]: HTMLOptionElement };
  menuLabel: HTMLParagraphElement;
  menuList: HTMLUListElement;
  parent: HTMLDivElement;

  constructor(props: AnimationsMenuProps) {

    this.parent = props.parent;

    this.container = document.createElement('div');
    this.container.id = "menuAnimations";
    this.container.className = "menuContainer";

    this.menuList = document.createElement('ul');
    this.menuList.className = "menuList";

    const menuLILabel = document.createElement('li');
    this.menuList.appendChild(menuLILabel);

    this.menuLabel = document.createElement('p');
    this.menuLabel.className = "menuLabel";
    this.menuLabel.innerHTML = "Animations Menu";

    menuLILabel.appendChild(this.menuLabel);

    const menuLIEmotionSelect = document.createElement('li');
    this.menuList.appendChild(menuLIEmotionSelect);

    this.emotionSelect = document.createElement('select');
    this.emotionSelect.className = "menuSelect";

    menuLIEmotionSelect.appendChild(this.emotionSelect);

    const menuLIButtonList = document.createElement('li');
    this.menuList.appendChild(menuLIButtonList);

    this.buttonList = document.createElement('ul');
    this.buttonList.className = "menuListButton";

    menuLIButtonList.appendChild(this.buttonList);

    this.animations = {};
    this.buttonData = {};
    this.emotionSelectData = {};

    this.container.appendChild(this.menuList);

    this.onChangeEmotion = this.onChangeEmotion.bind(this);
    this.onClickAnimation = this.onClickAnimation.bind(this);

    this.changeEmotionCB = (emotion: string) => {};
    this.clickAnimationCB = (animation: string) => {};

    this.emotionSelect.addEventListener("change", this.onChangeEmotion);
  }

  resetEmotions() {
    Object.keys(this.emotionSelectData).forEach((emotion: string) => {
      this.emotionSelect.removeChild(this.emotionSelectData[emotion]);
      delete this.emotionSelectData[emotion];
    });
  }

  resetButtons() {
    Object.keys(this.buttonData).forEach((animation: string) => {
      (this.buttonData[animation].firstChild as HTMLButtonElement).removeEventListener("click", this.onClickAnimation);
      this.buttonList.removeChild(this.buttonData[animation]);
      delete this.buttonData[animation];
    });
  }

  setData(data: any) {
    if (data.onChangeEmotion && this.changeEmotionCB !== data.onChangeEmotion)
      this.changeEmotionCB = data.onChangeEmotion;

    if (data.onClickAnimation && this.clickAnimationCB !== data.onClickAnimation) 
      this.clickAnimationCB = data.onClickAnimation;

    if (data.emotionOptions) {
      this.resetEmotions();
      data.emotionOptions.forEach((emotion: string) => {
        this.emotionSelectData[emotion] = document.createElement('option');
        this.emotionSelectData[emotion].value = emotion;
        this.emotionSelectData[emotion].innerText = emotion;
        this.emotionSelect.appendChild(this.emotionSelectData[emotion]);
      });

    }

    if (data.emotionCurrent) {
      this.emotionSelect.value = data.emotionCurrent;
    }

    if (data.animationOptions) {
      this.animations = data.animationOptions;
    }

    if (!!data.emotionCurrent || !!data.animationOptions) {
      this.updateAnimationButtons();
    }
  }

  updateAnimationButtons() {
    this.resetButtons();
    const keys = Object.keys(this.animations);
    const emotionAnimations = keys.filter(
      (key) =>
        this.animations[key].emotion.toLowerCase() === this.emotionSelect.value.toLowerCase(),
    );
    emotionAnimations.forEach((animation: string) => {
      this.buttonData[animation] = document.createElement('li');
      const button: HTMLButtonElement = document.createElement('button');
      button.innerText = animation;
      button.value = animation;
      button.addEventListener("click", this.onClickAnimation);
      this.buttonData[animation].appendChild(button);
      this.buttonList.appendChild(this.buttonData[animation]);
    });
  }

  onChangeEmotion(evt: Event) {
    this.changeEmotionCB(this.emotionSelect.value);
    this.updateAnimationButtons();
  }

  onClickAnimation(evt: MouseEvent) {
    this.clickAnimationCB((evt.currentTarget as HTMLButtonElement).value);
  }

}

export default AnimationsMenu

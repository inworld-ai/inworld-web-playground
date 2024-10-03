import './AnimationsMenu.css';

export interface AnimationsMenuProps {
  parent: HTMLDivElement;
}

class AnimationsMenu {

  container: HTMLDivElement;
  menuLabel: HTMLParagraphElement;
  menuList: HTMLUListElement;
  parent: HTMLDivElement;

  constructor(props: AnimationsMenuProps) {

    this.parent = props.parent;

    this.container = document.createElement('div');
    this.container.id = "menuContainer";
    this.container.className = "menuContainer";

    this.menuList = document.createElement('ul');
    this.menuList.id = "menuList";
    this.menuList.className = "menuList";

    const menuLILabel = document.createElement('li');
    this.menuList.appendChild(menuLILabel);

    this.menuLabel = document.createElement('p');
    this.menuLabel.id = "menuLabel";
    this.menuLabel.className = "menuLabel";
    this.menuLabel.innerHTML = "Animations Menu";
    
    this.container.appendChild(this.menuList);
    menuLILabel.appendChild(this.menuLabel);

  }

}

export default AnimationsMenu

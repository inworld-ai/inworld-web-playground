import './GoalsMenu.css';

import GroupGoals, {
    TRIGGER_EXPLAIN_MUTATIONS, TRIGGER_EXPLAIN_PARAMETERS
} from '../../rooms/groups/GroupGoals';

export interface GoalsMenuProps {
  parent: HTMLDivElement;
}

class GoalsMenu {

  animations: { [key: string]: any };
  buttonData: { [key: string]: HTMLLIElement };
  buttonList: HTMLUListElement;
  changeMutationCB: (mutation: string) => void;
  changeTriggerCB: (trigger: string) => void;
  clickGoalCB: (goal: string) => void;
  container: HTMLDivElement;
  menuLabel: HTMLParagraphElement;
  menuList: HTMLUListElement;
  menuLISelectMutation: HTMLLIElement;
  menuLISelectTrigger: HTMLLIElement;
  parent: HTMLDivElement;
  selectMutation: HTMLSelectElement;
  selectMutationOptions: { [key: string]: HTMLOptionElement };
  selectTrigger: HTMLSelectElement;
  selectTriggerOptions: { [key: string]: HTMLOptionElement };

  constructor(props: GoalsMenuProps) {

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
    this.menuLabel.innerHTML = "Goals Menu";

    menuLILabel.appendChild(this.menuLabel);

    const menuLIButtonList = document.createElement('li');
    this.menuList.appendChild(menuLIButtonList);

    this.buttonList = document.createElement('ul');
    this.buttonList.className = "menuListButton";

    menuLIButtonList.appendChild(this.buttonList);

    this.menuLISelectMutation = document.createElement('li');
    // this.menuList.appendChild(this.menuLISelectMutation);

    this.selectMutation = document.createElement('select');
    this.selectMutation.className = "menuSelect";

    this.menuLISelectMutation.appendChild(this.selectMutation);

    this.menuLISelectTrigger = document.createElement('li');
    // this.menuList.appendChild(this.menuLISelectTrigger);

    this.selectTrigger = document.createElement('select');
    this.selectTrigger.className = "menuSelect";

    this.menuLISelectTrigger.appendChild(this.selectTrigger);

    this.animations = {};
    this.buttonData = {};
    this.selectMutationOptions = {};
    this.selectTriggerOptions = {};

    this.container.appendChild(this.menuList);

    this.onChangeMutation = this.onChangeMutation.bind(this);
    this.onChangeTrigger = this.onChangeTrigger.bind(this);
    this.onClickGoal = this.onClickGoal.bind(this);

    this.changeMutationCB = (mutation: string) => {};
    this.changeTriggerCB = (trigger: string) => {};
    this.clickGoalCB = (goal: string) => {};

    this.selectMutation.addEventListener("change", this.onChangeMutation);
    this.selectTrigger.addEventListener("change", this.onChangeTrigger);
  }

  setData(data: any) {
    if (data.onChangeMutation && this.changeMutationCB !== data.onChangeMutation)
      this.changeMutationCB = data.onChangeMutation;

    if (data.onChangeTrigger && this.changeTriggerCB !== data.onChangeTrigger)
      this.changeTriggerCB = data.onChangeTrigger;

    if (data.onClickGoal && this.clickGoalCB !== data.onClickGoal) 
      this.clickGoalCB = data.onClickGoal;

    if (data.goalsOptions) {
      Object.keys(data.goalsOptions).forEach((goal: string) => {
        this.buttonData[goal] = document.createElement('li');
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = data.goalsOptions[goal];
        button.value = goal;
        button.addEventListener("click", this.onClickGoal);
        this.buttonData[goal].appendChild(button);
        this.buttonList.appendChild(this.buttonData[goal]);
      });
    }

    if (data.mutationOptions) {
      data.mutationOptions.forEach((mutation: string) => {
        this.selectMutationOptions[mutation] = document.createElement('option');
        this.selectMutationOptions[mutation].value = mutation;
        this.selectMutationOptions[mutation].innerText = mutation;
        this.selectMutation.appendChild(this.selectMutationOptions[mutation]);
      });
    }

    if (data.triggerOptions) {
      data.triggerOptions.forEach((trigger: string) => {
        this.selectTriggerOptions[trigger] = document.createElement('option');
        this.selectTriggerOptions[trigger].value = trigger;
        this.selectTriggerOptions[trigger].innerText = trigger;
        this.selectTrigger.appendChild(this.selectTriggerOptions[trigger]);
      });
    }
  }

  onClickGoal(evt: MouseEvent) {
    const goal: string = (evt.currentTarget as HTMLButtonElement).value;
    this.clickGoalCB(goal);

    console.log('GoalsMenu onClickGoal', goal);

    if (this.menuList.contains(this.menuLISelectMutation))
      this.menuList.removeChild(this.menuLISelectMutation);

    if (this.menuList.contains(this.menuLISelectTrigger))
      this.menuList.removeChild(this.menuLISelectTrigger);

    if (goal === TRIGGER_EXPLAIN_MUTATIONS) 
      this.menuList.appendChild(this.menuLISelectMutation);
    
    if (goal === TRIGGER_EXPLAIN_PARAMETERS) 
      this.menuList.appendChild(this.menuLISelectTrigger);

  }

  onChangeMutation(evt: Event) {
    this.changeMutationCB(this.selectMutation.value);
  }

  onChangeTrigger(evt: Event) {
    this.changeTriggerCB(this.selectTrigger.value);
  }

}

export default GoalsMenu

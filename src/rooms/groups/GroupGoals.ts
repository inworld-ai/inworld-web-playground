import { Vector3 } from 'three';

import { EVENT_INWORLD_STATE, inworld, STATE_OPEN } from '../../inworld/Inworld';
import { JSONFileLoader } from '../../loaders/JSONFileLoader';
import ModelInnequin from '../../models/ModelInnequin';
import { RoomTypes } from '../../types/RoomTypes';
import { RoomMenuType, uiController } from '../../ui/UIController';
import { Config } from '../../utils/config';
import { log } from '../../utils/log';
import GroupBase from './GroupBase';

const CHARACTER_ID =
  'workspaces/inworld-playground/characters/goals_bot_-_innequin';
const DATA_URI = '.' + Config.AssetBaseURI + '/data/cities.json';
const NAME_INNEQUIN = 'InnequinGoals';
const SKIN_INNEQUIN = 'CAMO';
export const TRIGGER_DEMO_PARAMETERS = 'demo_parameters';
export const TRIGGER_EXPLAIN_DYNAMIC_DATA_RETRIEVAL =
  'explain_dynamic_data_retrieval';
export const TRIGGER_EXPLAIN_INTENTS = 'explain_intents';
export const TRIGGER_EXPLAIN_PARAMETERS = 'explain_parameters';
export const TRIGGER_EXPLAIN_MUTATIONS = 'explain_mutations';
export const TRIGGER_EXPLAIN_VERBATIM = 'explain_verbatim';
export const TRIGGER_GET_POPULATION = 'get_population';
export const TRIGGER_PROVIDE_POPULATION = 'provide_population';
export const TRIGGER_SET_CHARACTER_NAME = 'set_character_name';
export const TRIGGER_WELCOME = 'greet_player';

export interface GroupGoalsProps {
  position?: Vector3;
  rotation?: Vector3;
  onLoad: () => void;
}

export default class GroupGoals extends GroupBase {

  goalsOptions: { [key: string]: string };
  loaderCities: JSONFileLoader;
  mutationOptions: string[];
  triggerOptions: string[];
  innequin: ModelInnequin;
  isLoaded: boolean;
  onLoaded: () => void;

  constructor(props: GroupGoalsProps) {

    super({name: 'GroupGoals', position: props.position, rotation: props.rotation});

    this.isLoaded = false;

    this.goalsOptions = {};
    this.goalsOptions[TRIGGER_EXPLAIN_INTENTS] = 'Intent Recognition';
    this.goalsOptions[TRIGGER_EXPLAIN_VERBATIM] = 'Verbatim Responses';
    this.goalsOptions[TRIGGER_EXPLAIN_PARAMETERS] = 'Triggers with Parameters';
    this.goalsOptions[TRIGGER_EXPLAIN_DYNAMIC_DATA_RETRIEVAL] = 'Dynamic Data Retrieval';
    this.goalsOptions[TRIGGER_EXPLAIN_MUTATIONS] = 'Character Mutations';

    this.mutationOptions = ['Bob', 'Gene', 'Ringo', 'James'];
    this.triggerOptions = ['Dogs', 'Cats', 'Horses', 'Birds'];

    this.onChangeMutation = this.onChangeMutation.bind(this);
    this.onChangeTrigger = this.onChangeTrigger.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClickGoal = this.onClickGoal.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoadError = this.onLoadError.bind(this);
    this.onLoaded = props.onLoad;
    this.onStateInworld = this.onStateInworld.bind(this);

    this.innequin = new ModelInnequin(
      {
        name: NAME_INNEQUIN,
        characterId: CHARACTER_ID,
        skinName: SKIN_INNEQUIN,
        isLoaded: true,
        position: new Vector3(0, 0, 0),
        onClick: this.onClick,
        setConfig: this.onLoad,
      }
    );

    inworld.addListener(EVENT_INWORLD_STATE, this.onStateInworld);

    this.loaderCities = new JSONFileLoader({ name: 'cityData', fileURI: DATA_URI});
    this.loaderCities.load(this.onLoad, this.onLoadError);
  }

  onChangeMutation(mutation: string) {
    console.log('GroupGoals: onChangeMutation', mutation);
  }

  onChangeTrigger(trigger: string) {
    console.log('GroupGoals: onChangeTrigger', trigger);
  }

  onClick(characterName: string) {
    console.log('RoomAnimations: onClick', characterName);
    if (characterName === NAME_INNEQUIN) {
      uiController.setRoomMenuType(RoomMenuType.GOALS);
    }
  }
 
  onClickGoal(goalTrigger: string) {
    console.log('GroupGoals: onClickGoal', goalTrigger);
    if (inworld.sendTrigger) { 
      inworld.sendTrigger(goalTrigger);
    }
  }

  onFrame(delta: number) {
    if (this.innequin.isLoaded) {
      this.innequin.frameUpdate(delta);
    }
  }

  onLoad() {

    if (
      this.innequin &&
      this.innequin.isLoaded && 
      this.loaderCities &&
      this.loaderCities.data
    ) {

      uiController.setRoomMenuData({ 
        type: RoomTypes.GOALS,
        goalsOptions: this.goalsOptions,
        mutationOptions: this.mutationOptions,
        triggerOptions: this.triggerOptions,
        onClickGoal: this.onClickGoal, 
        onChangeMutation: this.onChangeMutation, 
        onChangeTrigger: this.onChangeTrigger 
      });

      this.group.add(this.innequin.group);

      this.isLoaded = true;
      this.onLoaded();

    }

  }
   
  onLoadError() {
    log('GroupGoals onLoadError: There was an error loading the cities data file.');
  }
   
  onStateInworld(state: string) {
    if ((inworld.name === NAME_INNEQUIN) 
      && state === STATE_OPEN) {
        inworld.sendTrigger(TRIGGER_WELCOME);
    }
  }
}

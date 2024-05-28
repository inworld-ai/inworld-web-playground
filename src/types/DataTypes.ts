export type CharactersDataType = {
  [key: string]: CharacterDataType;
}

export type CharacterDataType = {
  assetBaseURI: string;
  characterID: string;
  configURI: string;
}

export type SoundsDataType = {
  [key: string]: string;
}

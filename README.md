# Inworld Web Playground

The Inworld Web Playground is a React based project to demonstrate the different capabilities that Inworld services offers. Each capability has been programmed into it's own 3D room you can test it in.

## Table of Contents

- [Requirements](#req)
- [Setup](#setup)
- [Running](#run)

<br/>

## Requirements <a id="req" name="req"></a>

- Node.js 18+
- Yarn
- Inworld Web SDK [generate_token](https://github.com/inworld-ai/inworld-web-sdk/tree/main/examples/generate_token) example authentication server project

<br/>

## Setup <a id="setup" name="setup"></a>

1. In Inworld Studio import the Inworld Playground workspace token into your account. From your [workspaces homepage](https://studio.inworld.ai/workspaces) click on `Import/Export` and import this token `2H3FDkRg5sX9`.
1. Setup and start the Inworld [generate_token](https://github.com/inworld-ai/inworld-web-sdk/tree/main/examples/generate_token) authentication server project. The setup process will require API keys and Scene ID from the previously imported workspace. You will need to create the new keys located in the Integrations section of the workspace. For the Scene ID use the one for Inworld Playground.
1. Open your terminal and navigate to the root directory of this project.
1. Run `yarn install` to install the dependencies.
1. The 3D assets are automatically installed as apart of the `yarn install` process in the `postinstall` phase. If you wish to manually download them you can find them [here](https://storage.googleapis.com/innequin-assets/playground/inworld-web-playground-assets-v1.0.zip).
1. From the root directory of this project copy the `.env-sample` file to `.env`. Open the new `.env` file and paste the Scene ID previously obtained into the `REACT_APP_INWORLD_SCENE_ID` environment variable as well as a default Character ID into the `REACT_APP_INWORLD_CHARACTER_ID` environment variable. Both of these ID's can be found on Inworld Studio for the workspace imported. For the default character ID we recommend using the `Innequin` base character.

<br/>

## Running <a id="run" name="run"></a>

- Open your terminal and navigate to the root directory of this project.
- Run `yarn start` to launch the project in your web browser.

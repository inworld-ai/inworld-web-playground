# Inworld Web Playground

The Inworld Web Playground is a Typescript based project to demonstrate the different capabilities that Inworld services offers. Each capability has been programmed into it's own 3D room you can test it in.

## Table of Contents

- [Requirements](#req)
- [Setup](#setup)
- [Running Development](#run-dev)
- [Building Production](#build-prod)
- [Running Production](#run-prod)

<br/>

## Requirements <a id="req" name="req"></a>

- GitHub
- Node.js 18+
- Yarn
- Inworld Web SDK [generate_token](https://github.com/inworld-ai/inworld-web-sdk/tree/main/examples/generate_token) example authentication server project

<br/>

## Setup <a id="setup" name="setup"></a>

1. In Inworld Studio import the Inworld Playground workspace token into your account. From your [workspaces homepage](https://studio.inworld.ai/workspaces) click on `Import/Export` and import this token `2H3FDkRg5sX9`.
1. Setup and start the Inworld [generate_token](https://github.com/inworld-ai/inworld-web-sdk/tree/main/examples/generate_token) authentication server project. The setup process will require API keys and Scene ID from the previously imported workspace. You will need to create the new keys located in the Integrations section of the workspace. For the Scene ID use the one for Inworld Playground.
1. Open your terminal and navigate to the root directory of this project.
1. Run `yarn install` to install the program dependencies.
1. Run `yarn run install:assets` to install the 3D assets. If you wish to manually download them you can find them [here](https://storage.googleapis.com/innequin-assets/playground/inworld-web-playground-assets-v4.5.zip).
1. From the root directory of this project copy the `.env-sample` file to `.env`. Open the new `.env` file and paste the Scene ID previously obtained into the `VITE_INWORLD_SCENE_ID` environment variable as well as a default Character ID into the `VITE_INWORLD_CHARACTER_ID` environment variable. Both of these ID's can be found on Inworld Studio for the workspace imported. For the default character ID we recommend using the `Innequin` base character.
1. (Optional) For running in production install

<br/>

## Running Development <a id="run-dev" name="run-dev"></a>

- Open your terminal and navigate to the root directory of this project.
- Run `yarn start` to launch the project in your web browser.

<br/>

## Building Production <a id="build-prod" name="build-prod"></a>

- Open your terminal and navigate to the root directory of this project.
- Run `yarn build` to build a production version of this project.

<br/>

## Running Production <a id="run-prod" name="run-prod"></a>

- Open your terminal and navigate to the root directory of this project.
- Run `serve -s build` to launch the project in your web browser.

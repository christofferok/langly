# Langly

<img alt="Langly icon" src="icons/icon.png" width="100" height="100">

Simple app to scan Laravel app for `__("String to be translated")` and manage the .json translation files. Heavily inspired by [https://github.com/themsaid/laravel-langman-gui](https://github.com/themsaid/laravel-langman-gui). No need to install any Laravel packages. Just launch the app and drag (or open) a directory into the app. 

## Download
Download one of the prebuilt apps from [https://github.com/christofferok/langly/releases](https://github.com/christofferok/langly/releases) 

## Usage

Any .json language files managed with the app will be overwritten on save, so make sure you use git or keep a backup of your files 😊

<img alt="Usage" src="https://cloud.githubusercontent.com/assets/11269635/26125501/a60e39d0-3a82-11e7-8916-e4012efa2a6a.gif">

## Run from source

`npm install`

`npm start`

## Package app
If you want to package the app for your platform, run: `npm run package`.

The app will then be in `release-builds/`

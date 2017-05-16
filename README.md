# Langly

<img alt="Langly icon" src="icons/icon.png" width="100" height="100">

Simple app to scan Laravel app for `__("String to be translated")` and manage the .json translation files. No need to install any Laravel packages. Just launch the app and drag (or open) a directory into the app. 

## Usage
`npm install`

`npm start`

Any .json language files managed with the app will be overwritten on save, so make sure you use git or keep a backup of your files 😊

<img alt="Usage" src="usage.gif">

## Package app
If you want to package the app for your platform, run: `npm run package`.

The app will then be in `release-builds/`

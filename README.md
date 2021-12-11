# Getting started

Run `npm install` from the root of the project to download all dependencies.

In order to run the IOS app you have to run `npm run ios:build` from the root of the project.

## Run the app

### Android
`npm run android` will compile and run the app for android. Either on the android emulator or the connected device.


### IOS

`npm run ios:build` generated the libraries needed to run the ios app. 
To run the app on the simulator call `npm run ios`.
To run the aoo on a device call `react-native run-ios --device \"NAME_OF_THE_DEVICE\"`, replace NAME_OF_THE_DEVICE with the name of the device to run onto.


### Web

#### Debug
Run `npm run web` to run the web version of the app. This will compile and run the website on localhost:3000.
#### Release
In order to create a release version of the web app call `npm run web:release` this will create a folder `build` that contains a standalone version of the app that can be served using IIS or any other tool that can serve static content (.NET Core REST Service or Delphi REST service).


### Windows

#### Debug
Run `npm run electron` on a windows machine to run the desktop version on windows. This is the debug version that listen on localhost.

#### Release
Run `npm run electron:release` on a windows machine to create a single standalone EXE for distribution. You can find the release version in `electron/dist`.


### MacOS

#### Debug
Run `npm run electron` on a apple machine to run the desktop version on MacOS. This is the debug version that listen on localhost.

#### Release
Run `npm run electron:release` on a apple machine to create a single standalone EXE for distribution. You can find the release version in `electron/dist`.
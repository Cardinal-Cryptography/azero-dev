# @polkadot/apps-electron

Desktop azero.dev client for Windows, Mac and Linux.

## Development and testing

Follow steps described [here](https://github.com/polkadot-js/apps#development) to setup the project.

* Run `yarn start:electron` to start the app in development mode. You will possibly see the `Not Found / 404` message. It's ok, just wait for the build to finish and refresh pressing `Ctrl+R`.
* Run `yarn test` to run tests
* Run `yarn packElectron:(mac|linux|windows)` with the OS you want to build for to create the app executable. Find the packages in `packages/apps-electron/release`.

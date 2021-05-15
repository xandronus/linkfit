## Build and Run Fitbit App in Simulator ##

[Link](https://dev.fitbit.com/build/guides/command-line-interface/)

* First time launch
```
npm add --dev @fitbit/sdk
npm add --dev @fitbit/sdk-cli
npx fitbit-build generate-appid
```
* Start Fitbit Simulator [Download Link](https://simulator-updates.fitbit.com/download/latest/win)
* Launch fitbit shell
``` 
npx fitbit-build
npx fitbit
```
* Inside fitbit shell:
```
fitbit$ install
```
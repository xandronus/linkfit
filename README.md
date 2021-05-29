# LinkFit #
### Earn Crypto Rewards for Exercise ###
<img src="/docs/fitbit-app.PNG" align="left" width="200px"/>

LinkFit(LFIT) is a ERC20 token that is rewarded through fitbit activity and tracked through a custom fitbit application.

Watch an overview and demo of the application in action in this
[Demo Video](https://www.youtube.com/watch?v=dujMX-tScGs)

Project consists of:
  - Custom fitbit app/companion app build with FitBit SDK
  - An ERC20 smart contract enhanced to support exercise redemption via a chainlink oracle deployed with HardHat
  - An set of serverless APIs and website hosted in Vercel with NextJS

<br clear="left"/>

## Sequence Diagram ##
![](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgTGlua0ZpdCBBcmNoaXRlY3R1cmUKYWN0b3IgVXNlcgpwYXJ0aWNpcGFudCBGaXRCaXQABg1Db21wYW5pb24gQXBwACANAFAJcGkKClVzZXItPgA6BjogRXhlcmNpc2VzCgBMBi0-ADoNOiBIZWFsdGggRGF0YVN5bmMKAFkNLT4AUAs6IFN1Ym1pdAAnDAoAcAstPlNtYXJ0IENvbnRyYWN0OiBTQwArCFJlZGVtcHRpb24gUmVxdWVzdAoAHw4tPkNoYWlubGluayBBZGFwdGVyOiBHZXQgc3RlcHMKAAwRAFoTdG9yZSBTACoFAHkdUmVkZWVtACMHAHYQQmxvY2tjaGFpbjogVHJhbnNmZXIgVG9rZW5zCgASCgCBWRIAHgUgQmFsYW5jZQCCCA4AgmIPU3luYyByZXNwb25zZQCCfhhHZXQARA8AgnwcABwSAIMKDQCBSAxHZXQgRVJDMjAAgSMJAIFKDACDYQ0AgUYNIFIAgSoIAIFAHAAcFwCERQ8AhRQIAEoXAIUhCFVzZXIAgkoP&s=modern-blue)

## How to Build & Run ##
Components:
* /smartcontract : [Token Smart Contract](smartcontract/README.md)
* /fitbitapp : [Custom FitBit App](fitbitapp/README.md)
* /linkfitapp : [LinkFit API and website](linkfitapp/README.md)

## How to Contribute ##
* PRs and suggestions are welcome!
* Join the discussion in the [Github Discussions](https://github.com/xandronus/linkfit/discussions)

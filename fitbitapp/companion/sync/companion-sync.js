import * as messaging from "messaging";
import * as settings from "../simple/companion-settings.js"

export function initialize() {
    messaging.peerSocket.addEventListener("message", (evt) => {
        if (evt.data && evt.data.command === "healthsync") {
            onHealthSync(evt.data);
        }
    });

    messaging.peerSocket.addEventListener("error", (err) => {
        console.error(`Connection error: ${err.code} - ${err.message}`);
    });
  }

/* Sample payload
{
    "command":"healthsync",
    "dateTime":"2021-05-19T17:03:00.000Z",
    "activity":
    {
        "adjusted":true,
        "activeZoneMinutes":
        {
            "adjusted":true,
            "constructor":{},
            "total":8
        },
        "constructor":{},
        "steps":14137,
        "distance":11310,
        "calories":3166,
        "elevationGain":33
    },
    "ethAddr":
    {
        "name":"0xAE123B000"
    },
    "apiUrl":
    {
        "name":"https://linkfit.vercel.app/api"
    },
    "apiKey":
    {
        "name":"todoguidmodhuh"
    },
    "fitbitId":"44"
}
*/
export function onHealthSync(data) {
    console.log('Sync Received:' + JSON.stringify(data));

    const url = data.apiUrl.name + '/synchealth';
    var opts = 
    {
        fitbitid: data.fitbitId,
        cryptoaddr: data.ethAddr.name,
        timestamp: data.dateTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        steps: data.activity.steps
    };
    console.log(`POST: ${url} - ${JSON.stringify(opts)}`);
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',  
            'api_key': data.apiKey.name
        },        
        body: JSON.stringify(opts)
    }).then(response => {
        if (!response.ok) {            
            throw Error(response.statusText);
        }
        return response;
    }).then(response => response.json()).then(rsp => {
        console.log('Success:', rsp);
    }).catch((error) => {
        console.error(error);
    });

    syncCryptoBalance(data.apiUrl.name, data.ethAddr.name, data.apiKey.name);
    fireCryptoRedeem(data.apiUrl.name, data.ethAddr.name, data.apiKey.name);
}

function syncCryptoBalance(apiUrl, cryptoAddr, apiKey) {
    const url = apiUrl + `/balance?cryptoaddr=${cryptoAddr}`;
    console.log(`GET: ${url}`);
    fetch(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',  
            'api_key': apiKey
        }
    }).then(response => {
        if (!response.ok) {            
            throw Error(response.statusText);
        }
        return response;
    }).then(response => response.json()).then(rsp => {
        console.log('Success:', rsp);
        settings.sendValue("cryptoBal", rsp.balance);
    }).catch((error) => {
        console.error(error);
    });    
}

function fireCryptoRedeem(apiUrl, cryptoAddr, apiKey) {
    const url = apiUrl + `/redeem?cryptoaddr=${cryptoAddr}`;
    console.log(`POST: ${url}`);
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',  
            'api_key': apiKey
        }
    }).then(response => {
        if (!response.ok) {            
            throw Error(response.statusText);
        }
        return response;
    }).then(response => response.json()).then(rsp => {
        console.log('Success:', rsp);        
    }).catch((error) => {
        console.error(error);
    });    
}
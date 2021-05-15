import * as messaging from "messaging";

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

export function onHealthSync(data) {
    console.log('Sync Received:' + JSON.stringify(data));
}

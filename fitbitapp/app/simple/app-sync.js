import * as messaging from "messaging";
import { today } from "user-activity";
import { me as device } from "device";
import * as simpleSettings from "./device-settings";

export function linkFitSync(date) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log('linkFitSync date=' + date);
        const settings = simpleSettings.getSettings();
        const data = {
            command: 'healthsync',
            dateTime: date.toISOString(),
            activity: today.adjusted,
            ethAddr: settings.ethAddr,
            apiUrl: settings.apiUrl,
            apiKey: settings.apiKey,
            fitbitId: device.modelId
          }
        messaging.peerSocket.send(data);
    }   
}
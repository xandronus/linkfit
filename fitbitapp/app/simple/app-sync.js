import * as messaging from "messaging";
import { today } from "user-activity";

export function linkFitSync(date) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log('linkFitSync date=' + date);
        const data = {
            command: 'healthsync',
            dateTime: date.toISOString(),
            activity: today.adjusted
          }
        messaging.peerSocket.send(data);
    }   
}
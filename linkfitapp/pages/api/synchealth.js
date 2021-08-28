import * as database from "../../util/mongdb.js"
import * as eci from "../../util/ethcrypto.js"

export default async (req, res) => {
  var success = false
  await database.connect();
  const apikey = req.headers.api_key;
  if (!apikey || apikey !== process.env.API_KEY) {
    res.status(401).json({success: false, message: 'Authorization failure.'});
  }
  else {
    if (req.method === 'POST') {
        console.log(`POST /synchealth => ${JSON.stringify(req.body)}`);
        var crypto = eci.EthCrypto;
        var addr = await crypto.normalizeAddress(req.body.cryptoaddr);
        if (addr != null) {
          console.log(`  CryptoAddr normalized to ${addr}`);
          req.body.cryptoaddr = addr;
          await database.addOrGetAccount(req.body.devicetype, req.body.deviceid, req.body.cryptonetwork, req.body.cryptoaddr);
          await database.syncHealthData(req.body);
          success = true;  
        }
    }        
  }

  if (success)
    res.status(200).json({success:true});
  else
    res.status(400).json({success:false});
}
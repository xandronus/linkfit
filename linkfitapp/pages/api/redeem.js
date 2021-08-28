import {parse as parseQuery} from "querystring";
import * as database from "../../util/mongdb.js"
import * as eci from "../../util/ethcrypto.js"

// Called from device to initiate sc redemption process
export default async (req, res) => {
  var success = false
  await database.connect();
  const apikey = req.headers.api_key;
  if (!apikey || apikey !== process.env.API_KEY) {
    res.status(401).json({success: false, message: 'Authorization failure.'});
  }
  else {
    if (req.method === 'POST') {
      const url = new URL(req.url, 'http://localhost');
      const query = parseQuery(url.search.substr(1));
      console.log(`POST /redeem => cryptoaddr: ${query.cryptoaddr}`);      
      var crypto = eci.EthCrypto;
      var addr = await crypto.normalizeAddress(query.cryptoaddr);
      if (await database.isRedeemSteps('eth', addr)) {
        console.log('  Steps are available to redeem, initiating contract');
        await crypto.transferSteps(addr);
      }
      else {
        console.log('  No steps to redeem, redemption skipped');
      }

      if (await crypto.redeemTokens(addr)) {
        console.log('  Steps present in contract, tokens transferred');
      }

      success = true;
    }        
  }

  if (success)
    res.status(200).json({success:true});
  else
    res.status(400).json({success:false});
}
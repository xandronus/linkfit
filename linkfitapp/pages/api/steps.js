import {parse as parseQuery} from "querystring";
import * as database from "../../util/mongdb.js"
import * as eci from "../../util/ethcrypto.js"

// called from sc to notify of redemption
export default async (req, res) => {
  var respBody = {success:false};
  var respStatus = 400;
  
  if (req.method === 'GET') {            
    const url = new URL(req.url, 'http://localhost');
    const query = parseQuery(url.search.substr(1));
    var crypto = eci.EthCrypto;
    if (query.cryptoaddr) {
      var redeemedSteps = 0;
      console.log(`GET /steps => cryptoaddr: ${query.cryptoaddr}`);
      var addr = await crypto.normalizeAddress(query.cryptoaddr);
      if (addr) {
        await database.connect();
        redeemedSteps = await database.redeemSteps('eth', addr);
      }
      respBody = {success:true, steps:redeemedSteps};
      respStatus = 200;  
    }
  }        

  console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
  res.status(respStatus).json(respBody);
}
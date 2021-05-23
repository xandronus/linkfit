import {parse as parseQuery} from "querystring";
import * as database from "../../util/mongdb.js"
import * as crypto from "../../util/crypto.js"

export default async (req, res) => {

  await database.connect();
  var respBody = {success:false};
  var respStatus = 400;
  
  if (req.method === 'GET') {            
    const url = new URL(req.url, 'http://localhost');
    const query = parseQuery(url.search.substr(1));
    console.log(`GET /steps => cryptoaddr: ${query.cryptoaddr}`);
    var addr = await crypto.normalizeAddress(query.cryptoaddr);
    //TODO: redeem steps from mongo
    //var coinBalance = await crypto.getTokenBalance(query.cryptoaddr);
    respBody = {success:true, steps:"100"};
    respStatus = 200;  
  }        

  console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
  res.status(respStatus).json(respBody);
}
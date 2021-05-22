//import * as URL from "url";
import {parse as parseQuery} from "querystring";
import * as crypto from "../../util/crypto.js"

export default async (req, res) => {
  var respBody = {success:false};
  var respStatus = 400;

  const apikey = req.headers.api_key;
  if (!apikey || apikey !== process.env.API_KEY) {
    respBody = {success: false, message: 'Authorization failure.'};    
    respStatus = 401;
  }
  else {
    if (req.method === 'GET') {            
      const url = new URL(req.url, 'http://localhost');
      const query = parseQuery(url.search.substr(1));
      console.log(`GET /balance => cryptoaddr: ${query.cryptoaddr}`);
      var coinBalance = await crypto.getTokenBalance(query.cryptoaddr);
      respBody = {success:true, balance:coinBalance};
      respStatus = 200;  
    }        
  }

  console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
  res.status(respStatus).json(respBody);
}
import {parse as parseQuery} from "querystring";
import * as database from "../../util/mongdb.js"

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
      // TODO: Call smart contract to redeem for this address if there
      // is anything to redeem
      success = true;
    }        
  }

  if (success)
    res.status(200).json({success:true});
  else
    res.status(400).json({success:false});
}
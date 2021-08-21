import * as eci from "../../util/ethcrypto.js"

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
      console.log(`GET /steprate`);
      var crypto = eci.EthCrypto;
      var rateInTokens = await crypto.getStepRate(); // default should be 0.001 or 1/1000 steps
      respBody = {success:true, rate:rateInTokens}; 
      respStatus = 200;  
    }        
  }

  console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
  res.status(respStatus).json(respBody);
}
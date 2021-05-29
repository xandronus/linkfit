import * as database from "../../util/mongdb.js"

export default async (req, res) => {
  var respBody = {success:false};
  var respStatus = 400;

  const apikey = req.headers.api_key;
  if (!apikey || apikey !== process.env.API_KEY) {
    respBody = {success: false, message: 'Authorization failure.'};    
    respStatus = 401;
  } else { 
    if (req.method === 'GET') {            
      console.log('GET /api/history');
      await database.connect();
      var hist = await database.getHistory();
      respBody = {success:true, history:hist};
      respStatus = 200;  
    }
  }     

  console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
  res.status(respStatus).json(respBody);
}
import * as database from "../../util/mongdb.js"
import {DbSchema} from '../../util/mongodbschema'

export default async(req, res) => {
  await database.connect();
  const apikey = req.headers.api_key;
  if (!apikey || apikey !== process.env.API_KEY) {
    res.status(401).json({success: false, message: 'Authorization failure.'});
  }
  else {
    const model = DbSchema.getModels()
    if (model) {
      try {
        var newId = database.newId();
        var newAccount = new model.Account({_id: newId, fitbitid:"testfitbitid", cryptoaddr:"testcryptoaddr", timestamp:Date.now()});
        var savedAccount = await newAccount.save();
        res.status(200).json(savedAccount);
      } catch(err) {
        res.status(400).json({success: false, message: 'Cannot create account'});
      }
    } else {
      res.status(400).json({success: false, message: 'No mongo account model'});
    }
  }
}
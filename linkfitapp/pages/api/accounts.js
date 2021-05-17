import * as database from "../../util/mongdb.js"
import {DbSchema} from '../../util/mongodbschema'

export default (req, res) => {
  database.connect(async() => {
    const apikey = req.headers.api_key
    if (!apikey || apikey !== process.env.API_KEY) {
      res.status(401).json({success: false, message: 'Authorization failure.'});
    }
    else {
      const model = DbSchema.getModels()
      if (model) {
        var newId = database.newId();
        var newAccount = new model.Account({_id: newId, fitbitid:"testfitbitid", cryptoaddr:"testcryptoaddr", timestamp:Date.now()});
        newAccount.save(function(err) {
          if (err) {
            res.status(400).json({success: false, message: 'Cannot create account'});
          } else {
            res.status(200).json(newAccount);
          }
        });
      } else {
        res.status(400).json({success: false, message: 'No mongo account model'});
      }
    }
  })
}
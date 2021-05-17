import * as database from "../../util/mongdb.js"
import {DbSchema} from '../../util/mongodbschema'

export default (req, res) => {
  database.connect(async() => {
      const model = DbSchema.getModels()
      if (model) {
            res.status(200).json({success: true, message: 'Healthy'});
      } else {
        res.status(400).json({success: false, message: 'No mongo model'});
      }
  });
}
import * as mongoose from 'mongoose'
import {DbSchema} from './mongodbschema'
import * as fns from 'date-fns'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  } 

export async function connect(onConnected) {
    if (mongoose.connection.readyState != 1) {
        mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true })
          .then(() => {
            DbSchema.createSchemas();
            DbSchema.createModel();
            onConnected();
          })        
      } else {      
        onConnected();
      }
}

export function newId() {
    return new mongoose.Types.ObjectId;
}

async function createAccount(fbid, cpid, date) {
    console.log('creating account');                
    const model = DbSchema.getModels();
    var id = newId();
    var newAccount = new model.Account({_id: id, fitbitid:fbid, cryptoaddr:cpid, timestamp:date});    
    newAccount.save(function(err) {
        if (err) {
          console.log(`Failed to save account ${id}`);
        } else {
          return newAccount;
        }
    });
    return newAccount;
}

export async function addOrGetAccount(fbid, cpid) {
    console.log(`addOrGetAccount(${fbid}, ${cpid})`);
    const model = DbSchema.getModels();
    if (!model || !model.Account) {
        console.log('calling create account');
        return createAccount(fbid, cpid, Date.now());    
    } else {
        var search = {fitbitid: fbid, cryptoaddr: cpid};
        model.Account.findOne(search, function(err, account) {
            if (err || !account) {
                return createAccount(fbid, cpid, Date.now());
            } else {
                console.log('found account');
                return account;
            }
        });
    }
}

async function createHealthData(health, date) {
    var id = newId();
    console.log(`Creating new daily health record ${id}`);
    const model = DbSchema.getModels();
    var newhealthData = new model.HealthData({_id: id, fitbitid:health.fitbitid, cryptoaddr:health.cryptoaddr, timestamp:date, steps:health.steps, claimed:false});
    newhealthData.save(function(err){
        if (err) {
            console.log(`Error creating health data ${newhealthData._id} - ${err.message}`);
        }
        else {
            console.log(`Created health data ${newhealthData._id}`);
        }
    });            
}

export async function syncHealthData(health) {
    const model = DbSchema.getModels();

    var date = new Date(health.timestamp);

    if (!model.HealthData) {
        createHealthData(health, date);
    } else {
        // get current record for today
        var search = {
            fitbitid: health.fitbitid, 
            cryptoaddr: health.cryptoaddr, 
            timestamp: {
                $gte: fns.startOfDay(date),
                $lt: fns.endOfDay(date)
            }
        };
        console.log(`Health search filter: ${JSON.stringify(search)}`);
        model.HealthData.findOne(search, function(err, healthData) {
            if (err || !healthData) {
                createHealthData(health, date);
            } else {
                console.log(`Updating daily health record ${healthData._id}`);
                if (healthData.steps !== health.steps) {
                    healthData.steps = health.steps;
                    healthData.timestamp = date;
                    healthData.save(function(err){
                        if (err) {
                            console.log(`Error updating health data ${healthData._id}`);
                        }
                        else {
                            console.log(`Updated health data ${healthData._id}`);
                        }
                    });
                } else {
                    console.log(`Health data has not changed for ${healthData._id}, no update required.`);
                }
            }
        });
    }
}


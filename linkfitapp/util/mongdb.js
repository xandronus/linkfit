import * as mongoose from 'mongoose'
import {DbSchema} from './mongodbschema'
import * as fns from 'date-fns'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

export async function connect() {
    if (mongoose.connection.readyState != 1) {
        await mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true });
        DbSchema.createSchemas();
        DbSchema.createModel();
      }
}

export function newId() {
    return new mongoose.Types.ObjectId;
}

async function createAccount(fbid, cpid, date) {
    console.log('creating account');                
    const model = DbSchema.getModels();
    var id = newId();
    try {
        var newAccount = new model.Account({_id: id, fitbitid:fbid, cryptoaddr:cpid, timestamp:date});    
        var savedAccount = await newAccount.save();
        console.log(`Successfully created new account ${savedAccount._id}`);
    } catch(err) {
        console.log(`Failed to save account ${id}`);
    }
}

export async function addOrGetAccount(fbid, cpid) {
    console.log(`addOrGetAccount(${fbid}, ${cpid})`);
    const model = DbSchema.getModels();
    if (!model || !model.Account) {
        console.log('calling create account');
        await createAccount(fbid, cpid, Date.now());    
    } else {
        var search = {fitbitid: fbid, cryptoaddr: cpid};
        var account = await model.Account.findOne(search);
        if (!account) {
            await createAccount(fbid, cpid, Date.now());
        } else {
            console.log('found account');
        }
    }
}

async function createHealthData(health, date) {
    var id = newId();
    console.log(`Creating new daily health record ${id}`);
    try {
        const model = DbSchema.getModels();
        var newhealthData = new model.HealthData({_id: id, fitbitid:health.fitbitid, cryptoaddr:health.cryptoaddr, timestamp:date, steps:health.steps, claimed:false});
        var savedHealth = await newhealthData.save();
        console.log(`Created health data ${savedHealth._id}`);
    } catch(err) {
        console.log(`Error creating health data ${newhealthData._id} - ${err.message}`);
    }    
}

export async function syncHealthData(health) {
    const model = DbSchema.getModels();

    var date = new Date(health.timestamp);

    if (!model.HealthData) {
        await createHealthData(health, date);
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
        var healthData = await model.HealthData.findOne(search);
        if (!healthData) {
            await createHealthData(health, date);
        } else {
            console.log(`Updating daily health record ${healthData._id}`);
            if (healthData.steps !== health.steps) {
                healthData.steps = health.steps;
                healthData.timestamp = date;
                try {
                    var savedHealth = await healthData.save();
                    console.log(`Updated health data ${savedHealth._id}`);
                } catch (err) {
                    console.log(`Error updating health data ${healthData._id} - ${err.message}`);
                }
            } else {
                console.log(`Health data has not changed for ${healthData._id}, no update required.`);
            }
        }
    }
}

export async function redeemSteps(addr) {
    var cumulativeSteps = 0;
    const model = DbSchema.getModels();
    var date = new Date(Date.now());
    var search = {
        cryptoaddr: addr, 
        timestamp: {
            $lt: fns.startOfDay(date)
        }
    };
    console.log(`Redeem search filter: ${JSON.stringify(search)}`);
    const redeemedIds = [];
    for await (const healthRec of model.HealthData.find(search)) {
        cumulativeSteps = cumulativeSteps + healthRec.steps;
        healthRec.claims = true;
        // add record to redeem
        try {
            var savedHealthRec = await healthRec.save();
            redeemedIds.push(savedHealthRec._id);
            console.log(`Successfully updated health data ${healRec._id}`)
        } catch(err) {
            console.log(`Failure updating health data ${healthRec._id} - ${err.message}`);
        }        
    }

    if (redeemedIds.length > 0) {
        try {
            var id = newId();
            var newRedeemed = new model.Redeemed({_id: id, addr, timestamp:date, steps:cumulativeSteps, healthDataRecs: redeemedIds});
            var savedRedeemed = await newRedeemed.save();
            console.log(`Created redeemed ${savedRedeemed._id}`);
        } catch(err) {
            console.log(`Error redeemed for addr ${addr} - ${err.message}`);
        }        
    }

    return cumulativeSteps;
}

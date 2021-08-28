import * as mongoose from 'mongoose'
import {DbSchema} from './mongodbschema'
import * as fns from 'date-fns-tz'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

function dateToDateNbr(date, zone) {
    var utcDate = fns.utcToZonedTime(date, zone);
    return Number(fns.format(utcDate, 'yyyyMMdd', { timeZone: zone }));
}

function redeemFilter(cnet, addr, timezone) {
    var dateNow = new Date(Date.now());
    var dateNbr = dateToDateNbr(dateNow, timezone); 
    var search = {
        cryptonetwork: cnet,
        cryptoaddr: addr,
        claimed: false, 
        yyyymmdd: {
            $lt: dateNbr
        }
    };    
    console.log(`isRedeem search filter: ${JSON.stringify(search)}`);
    return search;
}

async function createAccount(dtype, did, cpnet, cpid, date) {
    console.log('creating account');                
    const model = DbSchema.getModels();
    var id = newId();
    try {
        var newAccount = new model.Account({_id: id, devicetype:dtype, deviceid:did, cryptonetwork: cpnet, cryptoaddr:cpid, timestamp:date});    
        var savedAccount = await newAccount.save();
        console.log(`Successfully created new account ${savedAccount._id}`);
    } catch(err) {
        console.log(`Failed to save account ${id}`);
    }
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

export async function addOrGetAccount(dtype, did, cpnet, cpid) {
    console.log(`addOrGetAccount(${did}, ${cpid})`);
    const model = DbSchema.getModels();
    var date = new Date(Date.now());
    if (!model || !model.Account) {
        console.log('calling create account');
        await createAccount(dtype, did, cpid, date);    
    } else {
        var search = {devicetype: dtype, deviceid: did, cryptonetwork: cpnet, cryptoaddr: cpid};
        var account = await model.Account.findOne(search);
        if (!account) {
            await createAccount(dtype, did, cpnet, cpid, date);
        } else {
            console.log('found account');
        }
    }
}

async function createHealthData(health, dateNbr) {
    var id = newId();
    console.log(`Creating new daily health record ${id}`);
    try {
        const model = DbSchema.getModels();
        var date = new Date(health.timestamp);
        var newhealthData = new model.HealthData({_id: id, devicetype:health.devicetype, deviceid:health.deviceid, cryptonetwork:health.cryptonetwork, cryptoaddr:health.cryptoaddr, timestamp:date, yyyymmdd:dateNbr, timezone:health.timezone, steps:health.steps, claimed:false});
        var savedHealth = await newhealthData.save();
        console.log(`Created health data ${savedHealth._id}`);
    } catch(err) {
        console.log(`Error creating health data ${newhealthData._id} - ${err.message}`);
    }    
}

async function getTimeZone(addr) {
    var search = {
        cryptoaddr: addr
    };
    console.log(`Health search filter: ${JSON.stringify(search)}`);
    const model = DbSchema.getModels();
    var healthData = await model.HealthData.findOne(search);
    if (!healthData) {
        return 'UTC';
    } else {
        return healthData.timezone;
    }
}

export async function syncHealthData(health) {
    const model = DbSchema.getModels();
    var timestamp = new Date(health.timestamp);
    var dateNbr = dateToDateNbr(timestamp, health.timezone);
    console.log(`syncHealthData() - timestamp: ${health.timestamp}, timezone: ${health.timezone}, dateNbr: ${dateNbr}`);

    if (!model.HealthData) {
        await createHealthData(health, dateNbr);
    } else {
        // get current record for today
        var search = {
            devicetype: health.devicetype,
            deviceid: health.deviceid,
            cryptonetwork: health.cryptonetwork, 
            cryptoaddr: health.cryptoaddr, 
            yyyymmdd: dateNbr,
            timezone: health.timezone
        };
        console.log(`Health search filter: ${JSON.stringify(search)}`);
        var healthData = await model.HealthData.findOne(search);
        if (!healthData) {
            await createHealthData(health, dateNbr);
        } else {
            console.log(`Updating daily health record ${healthData._id}`);
            if (healthData.steps !== health.steps) {
                healthData.steps = health.steps;
                healthData.timestamp = timestamp;
                healthData.yyyymmdd = dateNbr;
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

export async function isRedeemSteps(cnet, addr) {
    var result = false;
    const model = DbSchema.getModels();
    var timezone = await getTimeZone(addr);
    var search = redeemFilter(cnet, addr, timezone);

    try {
        var rec = await model.HealthData.exists(search);
        if (rec) {
            result = true;
        }
    } catch (err) {
        console.error(err);
    }

    return result;
}

export async function redeemSteps(cnet, addr) {
    var cumulativeSteps = 0;
    const model = DbSchema.getModels();

    var timezone = await getTimeZone(addr);
    var search = redeemFilter(cnet, addr, timezone);

    // redeem individual records
    const redeemedIds = [];
    for await (const healthRec of model.HealthData.find(search)) {
        cumulativeSteps = cumulativeSteps + healthRec.steps;
        healthRec.claimed = true;
        try {
            var savedHealthRec = await healthRec.save();
            redeemedIds.push(savedHealthRec._id);
            console.log(`Successfully updated health data ${healthRec._id}`)
        } catch(err) {
            console.log(`Failure updating health data ${healthRec._id} - ${err.message}`);
        }        
    }

    // add record to redeem
    if (redeemedIds.length > 0) {
        try {
            var id = newId();
            var date = new Date(Date.now());
            var newRedeemed = new model.Redeemed({_id: id, cryptonetwork:cnet, cryptoaddr:addr, timestamp:date, steps:cumulativeSteps, healthDataRecs: redeemedIds});
            var savedRedeemed = await newRedeemed.save();
            console.log(`Created redeemed ${savedRedeemed._id}`);
        } catch(err) {
            console.log(`Error redeemed for addr ${addr} - ${err.message}`);
        }        
    }

    return cumulativeSteps;
}

export async function getHistory() {
    console.log('Querying Redeemed');
    const model = DbSchema.getModels();
    var recs = await model.Redeemed.find({}).sort({timestamp: -1}).limit(10);
    return recs;
}

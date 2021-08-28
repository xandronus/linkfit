import * as mongoose from 'mongoose'

export var DbSchema = (function(){
    var _accountSchema = null;
    var _healthDataSchema = null;
    var _redeemedSchema = null;
  
    function createSchemas(){
        if (!_accountSchema) {
            _accountSchema =  new mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                devicetype: String,
                deviceid: String,
                cryptonetwork: String,
                cryptoaddr: String,
                timestamp: Date
            });
        }
        if (!_healthDataSchema) {
            _healthDataSchema = new mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                devicetype: String,
                deviceid: String,
                cryptonetwork: String,
                cryptoaddr: String,
                timestamp: Date, 
                yyyymmdd: Number, 
                timezone: String,
                steps: Number,
                claimed: Boolean
            });            
        }
        if (!_redeemedSchema) {
            _redeemedSchema = new mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                cryptonetwork: String,
                cryptoaddr: String,
                timestamp: Date,
                steps: Number,
                healthDataRecs: [mongoose.Schema.Types.ObjectId]
            });
        }
        console.log('Schemas created');
    }

    function createModel() {
    }

    function getAccountSchema(){
        return _accountSchema;
    }

    function getHealthDataSchema(){
        return _healthDataSchema;
    }

    function getRedeemedSchema(){
        return _redeemedSchema;
    }

    function getModels(){
        console.log("getting mongo models");
        const Account = mongoose.model('Account', _accountSchema);
        const HealthData = mongoose.model('HealthData', _healthDataSchema);
        const Redeemed = mongoose.model('Redeemed', _redeemedSchema);
    
        return {'Account': Account, 'HealthData': HealthData, 'Redeemed': Redeemed};        
    }
   
    return {
        createSchemas: createSchemas,
        createModel: createModel,
        getAccountSchema: getAccountSchema,
        getHealthDataSchema: getHealthDataSchema,
        getRedeemedSchema: getRedeemedSchema,
        getModels: getModels
    };
  }());
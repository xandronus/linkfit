import * as mongoose from 'mongoose'

export var DbSchema = (function(){
    var _accountSchema = null;
    var _healthDataSchema = null;
  
    function createSchemas(){
        if (!_accountSchema) {
            _accountSchema =  new mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                fitbitid: String,
                cryptoaddr: String,
                timestamp: Date
            });
        }
        if (!_healthDataSchema) {
            _healthDataSchema = new mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                fitbitid: String,
                cryptoaddr: String,
                timestamp: Date,
                steps: Number,
                claimed: Boolean
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

    function getModels(){
        console.log("getting mongo models");
        const Account = mongoose.model('Account', _accountSchema);
        const HealthData = mongoose.model('HealthData', _healthDataSchema);
    
        return {'Account': Account, 'HealthData': HealthData};        
    }
   
    return {
        createSchemas: createSchemas,
        createModel: createModel,
        getAccountSchema: getAccountSchema,
        getHealthDataSchema: getHealthDataSchema,
        getModels: getModels
    };
  }());
import {parse as parseQuery} from "querystring";
import * as eci from "../../util/ethcrypto.js"

export default async (req, res) => {
    var respBody = {success:false};
    var respStatus = 400;

    if (req.method === 'GET') {            
        const url = new URL(req.url, 'http://localhost');
        const query = parseQuery(url.search.substr(1));        
        var crypto = eci.EthCrypto;
        if (query.cryptoaddr) {
            console.log(`GET /cryptoaddr => cryptoaddr: ${query.cryptoaddr}`);
            var addr = await crypto.normalizeAddress(query.cryptoaddr);
            respBody = {success:true, address:addr};
            respStatus = 200;
        }  
    }        

    console.log(`  ${respStatus} => ${JSON.stringify(respBody)}`);
    res.status(respStatus).json(respBody);
}
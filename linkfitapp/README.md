# LinkFit App #
App is automatically been deployed to [Vercel](https://linkfit.vercel.app/) by a GitHub action

## API ##

**API healthiness check**
```
REQUEST:
GET /api/health

RESPONSE:
{
    "success": true,
    "message": "Healthy"
}
```

**Sync Health Data**
```
REQUEST:
POST /api/synchealth HTTP/1.1
api_key: {INSERT_API_KEY_HERE}
Content-Type: application/json
{
    "devicetype": "fitbit",
    "deviceid": "12345",
    "cryptonetwork": "eth",
    "cryptoaddr": "0xABCD000EF1111",
    "timestamp": "2021-05-17T01:41:15.348Z",
    "timezone": "America/Edmonton",
    "steps": 113
}

RESPONSE:
{
    "success": true
}
```

**Redeem Rewards**
```
REQUEST:
POST /api/redeem?cryptoaddr={ETH_ADDRESS_HERE} HTTP/1.1
api_key: {INSERT_API_KEY_HERE}

RESPONSE:
{
    "success": true
}
```

**Token Balance**
```
REQUEST:
GET /api/balance?cryptoaddr={ETH_ADDRESS_HERE} HTTP/1.1
api_key: {INSERT_API_KEY_HERE}

RESPONSE:
{
    "success": true,
    "balance": "0.986730694479989101"
}
```

**Steps To Redeem**
```
REQUEST:
GET /api/steps?cryptoaddr={ETH_ADDRESS_HERE} HTTP/1.1

RESPONSE:
{
    "success": true,
    "steps": "100"
}
```

**Normalize Crypto Address**
```
REQUEST:
GET /api/cryptoaddr?cryptoaddr={ETH_ADDRESS_HERE} HTTP/1.1
```

## Configuration

.env
```
DB_CONN="{mongo connection string}"
API_KEY="{INSERT_API_KEY_HERE}"
ETH_NET="kovan"
ALCHEMY_KEY="{alchemyapikey}"
PRIVATE_KEY="{smartcontract-private-key}"
```

## Build and Run

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

To run SSL version:
```bash
npm run https
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/health](http://localhost:3000/api/health). 

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
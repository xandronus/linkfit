# LinkFit App #
App is automatically been deployed to [Vercel](https://linkfit.vercel.app/)

## API ##

API healthiness check
```
GET /api/health
```

Sync Health Data
```
POST /api/synchealth HTTP/1.1
api_key: {INSERT_API_KEY_HERE}
Content-Type: application/json
{
    "fitbitid": "12345",
    "cryptoaddr": "0xABCD000EF1111",
    "timestamp": "2021-05-17T01:41:15.348Z",
    "steps": 113
}
```

Redeem Rewards
```
TODO:
```

## Build and Run

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
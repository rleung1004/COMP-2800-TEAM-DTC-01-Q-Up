import Twitter from 'twitter-lite';
import {Response, Request} from 'express';

const keys = {
    consumer_key: "ZyEwjXyEc9FWo4rcrnNWIviZ9",
    consumer_secret: "7agfDFN7EGJMqVWmx2iawgcPtTL8rbKR7qTPrN23dCx6kAilsC"
};

/**
 * Gets OAuth token from twitter.
 *
 * @param _:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 * 
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getTwitterOAuthToken = async (_:Request, res:Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const client = new Twitter(keys);
    console.log(_);    
    return await client.getRequestToken('http://localhost:3000/contactUs')
    .then((result:any) => {
        console.log(result.oauth_token);
        return res.status(200).json({oauthToken: result.oauth_token})    
    })
    .catch((err)=>{
        console.error(err);
        return res.status(500).json({general: "Could not get token."});
    });
};

/**
 * Gets the twitter access.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getTwitterAccessToken = async (req:Request, res:Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const client = new Twitter(keys);
    return await client
    .getAccessToken({oauth_verifier: req.body.oauthVerifier, oauth_token: req.body.oauthToken})
    .then((result) => {
        return res.status(200).json({
            tokens: {
                access_token_key: result.oauth_token,
                access_token_secret: result.oauth_token_secret,
                user_id: result.user_id,
                screen_name: result.screen_name
            }
        })
    })
    .catch((err)=>{
        console.error(err);
        return res.status(500).json({general: "Could not get token."});
    });
};

/**
 * Updates the user's status in twitter.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 403 if user attempted to tweet the same content twice in a row
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const tweet = async (req:Request, res:Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const {access_token_key, access_token_secret} = req.body.tokens;
    const client = new Twitter({
        ...keys,
        access_token_key,
        access_token_secret
        });
        client.post("statuses/update", {
            status: req.body.status,
            auto_populate_reply_metadata: true
          })
          .then(()=> res.status(201).json({general: "Successfully twitted."}))
          .catch((err) => {
              console.error(err);
              if (err.status === 403) {
                  res.status(403).json(err);
              }
              res.status(500).json({general:"Cannot tweet"});
          });
};

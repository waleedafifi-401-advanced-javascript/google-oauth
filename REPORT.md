# Google API Auth
[Following through this github link](https://github.com/googleapis/google-api-nodejs-client#oauth2-client), we were directed to create a [Client Id](https://console.cloud.google.com/apis/credentials/oauthclient) which we define the URL that calls google OAUTH, and other options to helps us connect to google with the ID and secret in the URL, after verification and authorization our google link redirects to another route with a bunch of request parameters matching our original option with scopes of google variables.

## How?
The steps to use OAuth Google were covered in details using [this link](https://dev.to/uddeshjain/authentication-with-google-in-nodejs-1op5). After getting the variables we would transform the needed request parameters into objects, and send it back to the screen.

The app also includes user database, and since we don't need to verify the password of incoming users through google OAuth, we directly authenticate them after it returns from the OAuth URL.

## Solution
The following represents sending the authorization request along with the options to google link that you would press to login:

```
let URL = 'https://accounts.google.com/o/oauth2/v2/auth';

let options = {
  response_type: 'code',
  client_id: '82394101385-jaqm9i6p3cdu3i374lgg1b9ao6gfnpe3.apps.googleusercontent.com',
  redirect_uri: 'http://localhost:3000/oauth',
  scope: 'openid email',
  state: 'http://localhost',
  access_type: 'offline',
}
```

The following represents exchanging code for token after being authorized:

```
const tokenResponse = await superagent.post("https://www.googleapis.com/oauth2/v4/token").send({
  code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: "authorization_code",
});

```

And finally exchanging the token to user info:

```
const userResponse = await superagent.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
  .set("user-agent", "express-app")
  .set("Authorization", `token ${token}`);
```
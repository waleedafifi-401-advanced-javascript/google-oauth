const superagent = require('superagent');
const users = require('./users.js');

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const { API_SERVER } = process.env;

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  const { access_token } = tokenResponse.body;

  return access_token;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  const user = userResponse.body;

  return user;
}

async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };

  const user = await users.save(userRecord);
  const token = users.generateToken(user);

  return [user, token];
}

// eslint-disable-next-line func-names
module.exports = async function authorize(req, res, next) {
  try {
    const { code } = req.query;
    console.log('(1) CODE:', code);

    const remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    const remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    const [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) { next(`ERROR: ${e.message}`); }
};

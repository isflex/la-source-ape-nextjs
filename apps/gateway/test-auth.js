const { CognitoIdentityProviderClient, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');

// Configuration from amplify_outputs.json
const userPoolId = 'eu-west-3_qlPCvZRxZ';
const clientId = '7619adlvbjm23ccp34g3bfmg79';
const region = 'eu-west-3';

async function getAccessToken(username, password) {
  const client = new CognitoIdentityProviderClient({ region });

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'ALLOW_USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const response = await client.send(command);

    if (response.AuthenticationResult) {
      console.log('Access Token:', response.AuthenticationResult.AccessToken);
      return response.AuthenticationResult.AccessToken;
    } else {
      console.log('Authentication challenge required:', response.ChallengeName);
      return null;
    }
  } catch (error) {
    console.error('Authentication failed:', error.message);
    return null;
  }
}

// Usage: node test-auth.js [username] [password]
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('Usage: node test-auth.js <username> <password>');
  process.exit(1);
}

getAccessToken(username, password);
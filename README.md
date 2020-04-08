# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


## User creation / login

### Create User

aws cognito-idp admin-create-user \
    --user-pool-id $USERPOOL_ID \
    --username $USER_EMAIL \
    --user-attributes Name=email,Value=$USER_EMAIL Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --temporary-password $USER_TMP_PASSWORD \
    --force-alias-creation

### Set new password

export COGNITO_CHALLENGE_SESSION=`aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --output json --client-id $USERPOOL_CLIENT_ID --auth-parameters USERNAME=$USER_EMAIL,PASSWORD=$USER_TMP_PASSWORD | jq -r .Session`

Respond to challenge and get token

aws cognito-idp admin-respond-to-auth-challenge --user-pool-id eu-west-1_pAWG85eN0 --client-id $USERPOOL_CLIENT_ID --challenge-responses "NEW_PASSWORD=$NEW_PASSWORD,USERNAME=$USER_EMAIL" --challenge-name NEW_PASSWORD_REQUIRED --session $COGNITO_CHALLENGE_SESSION

{
    "ChallengeParameters": {},
    "AuthenticationResult": {
        "AccessToken": "eyJraWQiOiJzcitDdGpFQlJcLzQwM...",
        "ExpiresIn": 3600,
        "TokenType": "Bearer",
        "RefreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBM...",
        "IdToken": "eyJraWQiOiJtZExkVDV0dTFoNWVmTUZuWG..."
    }
}

### Login

export ID_TOKEN=`aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --output json --client-id $USERPOOL_CLIENT_ID --auth-parameters USERNAME=$USER_EMAIL,PASSWORD=$NEW_PASSWORD | jq -r .AuthenticationResult.IdToken`
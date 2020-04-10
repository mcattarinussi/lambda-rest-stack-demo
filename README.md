# lambda-rest-stack-demo

This project is an attempt to integrate existing tools in order to provide a better development experience while developing a serverless rest api using AWS CDK and typescript.

The project implements rest apis for a basic To-do application. The endpoints allow to perform CRUD operations on the "todo" resource.

## System Overview

### AWS resources

The infrastructure is composed of the following AWS resources:

- api gateway rest api
- lambda functions to implement endpoints request handlers
- cognito user pool authorizer to protect endpoints
- dynamodb as storage solution
- cognito user pool to handle app users

### Available endpoints

- GET http://127.0.0.1:3000/todos
- POST http://127.0.0.1:3000/todos
- GET http://127.0.0.1:3000/todos/{id}
- PUT http://127.0.0.1:3000/todos/{id}
- DELETE http://127.0.0.1:3000/todos/{id}

### Authentication

The endpoints are protected by a [Cognito User Pool Authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html). Every request must include the user identity token in the `Authorization` header. Follow instructions in [User management](#user-management) to create a user and get a valid token.

## Project setup and tools

### Folder structure

The `src` folder contains the typescript code for both the app and the infrastructure:

```
src
├── app
│   ├── db.ts
│   ├── handlers
│   │   ├── createTodo
│   │   │   ├── index.local.ts
│   │   │   └── index.ts
│   │   ├── deleteTodo
│   │   │   ├── index.local.ts
│   │   │   ├── index.ts
│   |   |   └── ...
│   └── middlewares
└── infrastructure
    ├── api.ts
    ├── index.ts
    ├── stack.ts
    └── ...
```

Keeping all the code inside the same folder allows to simplify the project configurations (eg typescript, linter, dependencies, ...).

### Webpack

Using webpack to compile the typescript source code gives us many advantages:

- ability to split app and infrastructure build outputs
- optimize handlers: the webpack config will generate a separate module for each handler that will include only the required dependencies.
- easily include source maps
- optimize code for production builds

### AWS CDK

Once the code has been compiled by webpack we can use the standard cdk commands (diff, list, synth, ...) to manage our infrastructure. To deploy the app we simply need to run `cdk deploy`.

### Run locally

Using the [AWS SAM cli](https://github.com/awslabs/aws-sam-cli) it's possible to serve the api locally by providing the cloudformation template produced by `cdk synth`.

A [custom script](./local/run.sh) allows to bootstrap the api locally by simply run `npm run dev`. The steps performed by the script are:

- build the typescript code
- run cdk synth to produce the cloudformation template that will be used by the sam cli
- run a custom docker compose file which will perform the following actions:
    - bootstrap the api using the sam cli
    - run an instance of dynamodb local
    - create the dynamodb table
- run webpack in watch mode: any modification to the code of a lambda handler will be immediately reflected in the corresponding endpoint

The AWS SAM cli provides a great development experience to run the api locally. However, in order to bootstrap additional AWS resources we had to "manually" run additional containers and scripts (see dynamodb instance and table creation). Another workaround we had to implement is the "mock-authorizer" since the cognito authorizer is not supported by sam local. Having bespoke infrastructure code to run the app locally makes things difficult to maintain and error prone. Ideally we would like to reuse the same cloudformation template produced by `cdk synth` to deploy the infrastructure locally. A quick attempt to use [localstack](https://github.com/localstack/localstack) has failed, but it might worth investigating if there is a way to integrate it in the project.

### CI/CD

The CI/CD pipeline is implemented using [Github Actions](https://github.com/features/actions). Every build produces an artifact containing the output of the `cdk synth` command (namely the `cdk.out` folder) which includes both the handlers compiled code and the cloudformation template. That means we can easily redeploy an old artifact by running `cdk deploy --app cdk.out` and both application and infrastructure changes will be applied without having to rebuild anything.

## Development

### Run the apis locally

To run the api you need to install [Docker Compose](https://docs.docker.com/compose/install/) on your machine.

Then simply run:

    npm run dev

When running locally, the apis do not validate the user token against a cognito user pool but you still need to include a well-formed jwt token. You can even create the token manually as long as it contains the same payload properties of the cognito id token. The token expiration won't be validated.

#### Example: get all the todos for a user:

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer $ID_TOKEN" http://127.0.0.1:3000/todos

[
  {
    "id": "aa2505bc-a214-4b21-be03-e9ce332e5c25",
    "title": "My first TODO",
    "body": "An important thing to do!",
    "userId": "bfd056ab-f505-4535-9b4f-2d3d1fb2d1a4"
  },
  {
    "id": "f4e8c67c-7f6b-40dd-ae0e-c63396a4bc66",
    "title": "Another TODO",
    "userId": "bfd056ab-f505-4535-9b4f-2d3d1fb2d1a4"
  }
]
```

### Other useful commands

- build and watch in dev mode: `build:dev:watch`
- deploy from your local machine: `deploy:dev`
- run tests: `npm test`
- run the linter: `npm run lint`
- show infrastructure changes: `npm run cdk:diff`

## User management

### Create a new user

    aws cognito-idp admin-create-user \
        --user-pool-id $USERPOOL_ID \
        --username $USER_EMAIL \
        --user-attributes Name=email,Value=$USER_EMAIL Name=email_verified,Value=true \
        --message-action SUPPRESS \
        --temporary-password $USER_TMP_PASSWORD \
        --force-alias-creation

Then run this to set the new user password:

    export COGNITO_CHALLENGE_SESSION=`aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --output json --client-id $USERPOOL_CLIENT_ID --auth-parameters USERNAME=$USER_EMAIL,PASSWORD=$USER_TMP_PASSWORD | jq -r .Session`

Respond to challenge and get token:

    export ID_TOKEN=`aws cognito-idp admin-respond-to-auth-challenge --user-pool-id $USERPOOL_ID --client-id $USERPOOL_CLIENT_ID --challenge-responses "NEW_PASSWORD=$NEW_PASSWORD,USERNAME=$USER_EMAIL" --challenge-name NEW_PASSWORD_REQUIRED --session $COGNITO_CHALLENGE_SESSION | jq -r .AuthenticationResult.IdToken`

### Get an id token for an existing user

    export ID_TOKEN=`aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --output json --client-id $USERPOOL_CLIENT_ID --auth-parameters USERNAME=$USER_EMAIL,PASSWORD=$NEW_PASSWORD | jq -r .AuthenticationResult.IdToken`

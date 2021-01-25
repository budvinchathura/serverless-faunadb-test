# Introduction

Complete source code used with serverless faundb tutorial medium article.
&nbsp;

# Prerequisites and Configuration

 - Configured AWS CLI with administrator IAM role.
 - Create a database with faunadb and store access secret in a new file `env.json` in project root directory. File content should be as following where xxxxx is replaced with your access secret
```json
{
    "FAUNADB_SECRET_KEY":"xxxxx"
}
```
 - Install `serverless` as a global npm package

```bash
npm install -g serverless
```
 - Install local dependencies
```bash
npm install
```

 - Execute `fauna-setup.js` with node environment to setup Collections and Indexes in fauna Database

```bash
node fauna-setup.js
```
&nbsp;

# Deploy to AWS

Simply run the following command in terminal inside project root.
```bash
serverless deploy
```

If everything goes well, after few minutes, last few lines of the final output should look like the following text.\
'xxx' will be replaced with a unique id for your service
```
...
...
Service Information
service: serverless-faunadb-test
stage: dev
region: us-east-1
stack: serverless-faunadb-test-dev
resources: 56
api keys:
  None
endpoints:
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/{id}
  PUT - https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/{id}
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/follow
  DELETE - https://xxx.execute-api.us-east-1.amazonaws.com/dev/unfollow
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/followers/{id}
  DELETE - https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/{id}
functions:
  create: serverless-faunadb-test-dev-create
  list: serverless-faunadb-test-dev-list
  get: serverless-faunadb-test-dev-get
  update: serverless-faunadb-test-dev-update
  follow: serverless-faunadb-test-dev-follow
  unfollow: serverless-faunadb-test-dev-unfollow
  followers: serverless-faunadb-test-dev-followers
  remove: serverless-faunadb-test-dev-remove
layers:
  None
```
Now the service is deployed in AWS region `us-east-1` and you can check the created resources by login into AWS console and visiting https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks . It should show a new stack called `serverless-faunadb-test-dev`

&nbsp;

# Usage

Now you can use the API to do following tasks
 - Create user
 - Get user
 - List users
 - Update user
 - Add followers to a user
 - Remove followers from a user
 - List followers of a user
 - Remove a user

## Create a user

```bash
curl --request POST https://xxx.execute-api.us-east-1.amazonaws.com/dev/users --header "Content-Type: application/json" --data-raw '{"name":"Test user 1", "dob":"2000-01-01","email":"abc@abc.com","city":"Downtown"}'
```

Example Result:

*'id' field value might be different.*
```bash
{"status":"SUCCESS","data":{"user":{"name":"Test user 1","dob":"2000-01-01","city":"Downtown","email":"abc@abc.com","id":"288601255069090308"}}}
```

## Get user

```bash
# Replace user_id with the id of the user
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/user_id
```

Example output:
```bash
{"status":"SUCCESS","data":{"user":{"name":"Test user 1","dob":"2000-01-01","city":"Downtown","email":"abc@abc.com","id":"288601255069090308"}}}
```

## List users

```bash
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/users
```

Example output:
```bash
{"status":"SUCCESS","data":{"users":[{"name":"Test user 2","dob":"1990-03-15","city":"New City","email":"test@abc.com","id":"288254855497122309"},{"name":"Test user 1","dob":"2000-01-01","city":"Downtown","email":"abc@abc.com","id":"288601255069090308"}]}}

```

## Update a user

```bash
# Replace user_id with the id of the user
curl --request PUT https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/user_id --header "Content-Type: application/json" --data-raw '{"name":"Test user 11", "email":"xyz@abc.com"}'
```

Example Result:

*'id' field value might be different.*
```bash
{"status":"SUCCESS","data":{"user":{"name":"Test user 11","dob":"2000-01-01","city":"Downtown","email":"xyz@abc.com","id":"288601255069090308"}}}
```

## Follow a user
The convention is *`'from'` user follows `'to'` user*.

```bash
# Replace from_user_id and to_user_id with necessary values
curl --request POST https://xxx.execute-api.us-east-1.amazonaws.com/dev/follow/ --header "Content-Type: application/json" --data-raw '{ "from":"from_user_id", "to":"to_user_id" }'
```

Example Result:

*Returns a reference to follow record. Some id field values will be different.*
```bash
{"status":"SUCCESS","data":{"followRecord":{"from":{"@ref":{"id":"288254855497122309","collection":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}}}},"to":{"@ref":{"id":"288601255069090308","collection":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}}}},"followedOn":"2021-01-24T12:44:25.384Z","id":"288603154122015232"}}}
```

## Unfollow a user

```bash
# Replace from_user_id and to_user_id with necessary values
curl --request DELETE https://xxx.execute-api.us-east-1.amazonaws.com/dev/unfollow/ --header "Content-Type: application/json" --data-raw '{ "from":"from_user_id", "to":"to_user_id" }'
```

Example Result:

```bash
{"status":"SUCCESS","data":{"followRecord":{"from":{"@ref":{"id":"288254855497122309","collection":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}}}},"to":{"@ref":{"id":"288601255069090308","collection":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}}}},"followedOn":"2021-01-24T12:44:25.384Z","id":"288603154122015232"}}}
```

## List followers of a user

```bash
# Replace user_id with the id of the user
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/followers/user_id
```

Example output:
```bash
{"status":"SUCCESS","data":{"followers":[{"name":"User abc","dob":"2000-01-01","city":"Colombo","email":"test@test.com","id":"288246266470597125"},{"name":"User 20","dob":"1997-02-05","city":"New City","email":"abc@abc.com","id":"288254855497122309"}]}}

```

## Remove user

```bash
# Replace user_id with the id of the user
curl --request DELETE https://xxx.execute-api.us-east-1.amazonaws.com/dev/users/user_id
```

Example output:
```bash
{"status":"SUCCESS"}
```
&nbsp;

## Offline (Local) Execution
If you are on a Windows environment with VSCode editor, you will be able to use `.vscode/launch.json` to directly run this service in your local machine. For other environments the same file can be used with minor modifications. \
&nbsp;

When running locally, URL s will be prefixed as `localhost`. For example https://xxx.execute-api.us-east-1.amazonaws.com/dev/users is changed to http://localhost:3333/dev/users when running locally.
# Webapp
TEST
## Bill Tracking Application 

Technology Stack : Node.js, express, MySQL
Tools Used :  Postman, CircleCI, GitHub

## Build Instructions 

## Prerequisites 

1. Install Node.js (https://nodejs.org/en/download/package-manager/)
2. Install npm (https://www.npmjs.com/get-npm)
3. Install an editor such as Visual Studio Code
4. Install Express (https://expressjs.com/en/starter/installing.html)
5. Create an account with Postman (https://www.getpostman.com/)
6. Sign up for CircleCI (https://circleci.com/)
7. Install mySQL

## Clone the repository 

1. Create a copy of your own by forking the org by clicking on the `Fork` button
   (https://github.com/varmavimalv-spring2020/webapp). All your work must be done in the forked repo

2. Clone the forked repository by clicking on the `clone or download` button and select `Use SSH`
   (For example, I cloned using `git@github.com:VishakaVarmaVimal/webapp.git`)

## Setup Database 

Use `mysql -u username -p database_name < sql-data/create.sql` to create the required database schema

## Install dependencies 

`npm install`

Make sure to import the necessary libraries in each file. For example, import libraries into your file like this -

```
const connection = require('../model/db')
const bcrypt = require('bcrypt')
const validate = require('../validations/billValidation')
const uuidv4 = require('uuid/v4')
const basicAuthentication = require('basic-auth')
```

Create a feature branch in your forked repo to make changes. 

# Test your code

To test your code, make sure `npm install` was executed and your package.json contains mocha, chai and supertest
In the working directory, run the following command to test your code -

`npm test` or `npm run test`

## Run the code 

(Optional : Install nodemon : `https://www.npmjs.com/package/nodemon`)

Write the following command in the terminal -

`nodemon server.js` or `node server.js` 

## Postman

To check if the application is working as expected, after running the code, open Postman
Check for APIs using the following :
1. To create a new user - (POST)
`http://localhost:3000/users`
2. To get a user - (GET)
`http://localhost:3000/users/self`
3. To update a user - (PUT)
`http://localhost:3000/users/self`
4. To associate a bill with a user - (POST)
`http://localhost:3000/bill`
5. To get ALL the bills associated with a user - (GET)
`http://localhost:3000/bill`
6. To get a particular bill for a user, based on id - (GET)
`http://localhost:3000/bill/{id}`
7. To update a bill based on id - (PUT)
`http://localhost:3000/bill/{id}`
8. To delete a bill based on id - (DELETE)
`http://localhost:3000/bill/{id}`

For all the authenticated APIs, select "Basic Auth" under "Authorization" tab in Postman.

# Deploy

## CircleCi

Configure the config.yml file according to your database credentials (also configure the .env file)
Provide appropriate docker images
Check if your config file is valid by using command -
`circleci config validate`

## GitHub

After making changes to the code and testing them,
create a pull request from your forked repo to the org's master
Make sure the circleci jobs are running after clicking on 'Create Pull Request'
Make sure the circleci job passes and sends 'Success' to git
Merge your pull request
Check if circleCI is running a job for master branch after merging.

## References -

https://spring2020.csye6225.cloud/cna/

https://www.npmjs.com/package/bcrypt

https://www.npmjs.com/package/joi

https://www.npmjs.com/package/express-basic-auth

https://www.npmjs.com/package/uuid

https://circleci.com/docs/

https://circleci.com/docs/2.0/postgres-config/

https://circleci.com/docs/2.0/language-javascript/

https://cry.github.io/nbp/

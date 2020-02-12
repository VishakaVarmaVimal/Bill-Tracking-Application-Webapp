const connection = require('../model/db')
const bcrypt = require('bcrypt')
const validate = require('../validations/billValidation')
const uuidv4 = require('uuid/v4')
const basicAuthentication = require('basic-auth')

exports.users_create_bill = (req, res) => {

    const data = req.body
    const authenticateUser = basicAuthentication(req)
    const basicAuthCheck = req.headers.authorization

    //basic auth provides default naming convention as name and pass for email and password
    //check if the user has provided both email and password
    if(!basicAuthCheck) {
        return res.status(401).send({
            "message" : "Unauthorized Access"
        })
    }

    if(!authenticateUser.name || !authenticateUser.pass){
        return res.status(400).send({
            "message" : "Please provide email and password"
        })
    }

    //if both credentials given, check if the email exists in database, if it exists, check if the passwords match
    else{
        connection.query('SELECT * FROM UsersData where email_address = "'+authenticateUser.name+'"', (err, value) => {
            if(err){
                res.status(400).send(err)
            }
            else if(value.length == 0){
                res.status(400).send({
                    "message" : "No such email-id exists"
                })
            }
            else{
                if(bcrypt.compare(authenticateUser.pass, value[0].password).then(function(match) {
                    if(match){
                        validation_response = validate(req)
                        if(validation_response.status != 200){
                            res.status(validation_response.status).send({
                                "status" : validation_response.status,
                                "message" : validation_response.message
                            })
                        }
                        else{
                            data.id = uuidv4();
                            data.created_ts = new Date();
                            data.updated_ts = new Date();
                            data.owner_id = value[0].id;
                            categories = data.categories.join('|')
                            const sql = "INSERT INTO Bill (id, created_ts, updated_ts, owner_id, vendor, bill_date, due_date, amount_due, categories, paymentStatus) VALUES (?,?,?,?,?,?,?,?,?,?)";
                            const query = connection.query(sql, [data.id, data.created_ts, data.updated_ts,
                                data.owner_id, data.vendor, data.bill_date, data.due_date, data.amount_due, categories, data.paymentStatus],(err, results) => {
                                if(err) {
                                    return res.status(400).send(err)
                                }
                                return res.status(201).send(data)
                            });
                        }
                    }
                    else{
                        res.status(401).send({
                            "message" : "Invalid Password"
                        })
                    }
                }));
            }
        })
    }
}

exports.users_get_bills =  (req, res) => {
    const authenticateUser = basicAuthentication(req)
    const basicAuthCheck = req.headers.authorization

    if(!basicAuthCheck) {
        return res.status(401).send({
            "message" : "Unauthorized Access"
        })
    }

    //check if the user has provided both email and password
    if(!authenticateUser.name || !authenticateUser.pass){
        return res.status(400).send({
            "message" : "Please provide email and password"
        })
    }

    //if both credentials given, check if the email exists in database, if it exists, check if the passwords match
    else{
        connection.query('SELECT * FROM UsersData where email_address = "'+authenticateUser.name+'"', (err, value) => {
            if(err){
                res.status(400).send(err)
            }
            else if(value.length == 0){
                res.status(400).send({
                    "message" : "No such email-id exists"
                })
            }
            else{
                if(bcrypt.compare(authenticateUser.pass, value[0].password).then(function(match) {
                    if(match){
                        connection.query('SELECT DISTINCT Bill.* FROM Bill INNER JOIN UsersData on Bill.owner_id = ?', value[0].id, (err, result) => {
                            if(err){
                                res.status(400).send(err)
                            }
                            else{
                                if(result.length == 0){
                                    res.status(404).send({
                                        "message" : "No bills available"
                                    })
                                }
                                else{
                                for (i = 0; i < result.length; i++) {
                                    result[i].categories = result[i].categories.split('|')
                                    }
                                return res.send(result)
                                }
                            }
                        })
                    }
                    else{
                        return res.status(400).send({
                            "message" : "Please enter valid and correct credentials."
                        })
                    }
                }));
            }
        });
    }
}

exports.users_get_bills_id = (req, res) => {
    const authenticateUser = basicAuthentication(req)
    const getSingleId = req.params.id
    const basicAuthCheck = req.headers.authorization

    if(!basicAuthCheck) {
        return res.status(401).send({
            "message" : "Unauthorized Access"
        })
    }

    //check if the user has provided both email and password
    if(!authenticateUser.name || !authenticateUser.pass){
        return res.status(400).send({
            "message" : "Please provide email and password"
        })
    }

    //if both credentials given, check if the email exists in database, if it exists, check if the passwords match
    else{
        connection.query('SELECT * FROM UsersData where email_address = "'+authenticateUser.name+'"', (err, value) => {
            if(err){
                res.status(400).send(err)
            }
            else if(value.length == 0){
                res.status(400).send({
                    "message" : "No such email-id exists"
                })
            }
            else{
                if(bcrypt.compare(authenticateUser.pass, value[0].password).then(function(match) {
                    if(match){
                        connection.query('SELECT Bill.* FROM Bill INNER JOIN UsersData on Bill.owner_id = "'+value[0].id+'" AND Bill.id = "'+getSingleId+'"', (err, result) => {
                            if(err){
                                res.status(400).send(err)
                            }
                            else if(result.length == 0){
                                res.status(404).send({
                                    "message" : "No bills available for the requested ID"
                                })
                            }
                            else{
                                result[0].categories = result[0].categories.split('|')
                                return res.send(result[0])
                            }
                        })
                    }
                    else{
                        return res.status(404).send({
                            "message" : "Requested ID not found under your username."
                        })
                    }
                }));
            }
        });
    }
}

exports.users_update_bills_id = (req, res) => {
    const data = req.body
    const authenticateUser = basicAuthentication(req)
    const putSingleID = req.params.id
    const basicAuthCheck = req.headers.authorization

    if(!basicAuthCheck) {
        return res.status(401).send({
            "message" : "Unauthorized Access"
        })
    }

    //check if the user has provided both email and password
    if(!authenticateUser.name || !authenticateUser.pass){
        return res.status(400).send({
            "message" : "Please provide email and password"
        })
    }

    //if both credentials given, check if the email exists in database, if it exists, check if the passwords match
    else{
        connection.query('SELECT * FROM UsersData where email_address = "'+authenticateUser.name+'"', (err, value) => {
            if(err){
                res.status(400).send(err)
            }
            else if(value.length == 0){
                res.status(400).send({
                    "message" : "No such email-id exists"
                })
            }
            else{
                if(bcrypt.compare(authenticateUser.pass, value[0].password).then(function(match) {
                    if(match){
                        connection.query('SELECT Bill.* FROM Bill INNER JOIN UsersData on Bill.owner_id = "'+value[0].id+'" AND Bill.id = "'+putSingleID+'"', (err, result) => {
                            if(err){
                                res.status(400).send(err)
                            }
                            else if(result.length == 0){
                                res.status(404).send({
                                    "message" : "No bills available for the requested ID"
                                })
                            }
                            else{
                                validation_response = validate(req)
                                if(validation_response.status != 200){
                                    res.status(validation_response.status).send({
                                        "status" : validation_response.status,
                                        "message" : validation_response.message
                                    })
                                }
                                else{
                                    data.updated_ts = new Date();
                                    data.created_ts = result[0].created_ts
                                    data.owner_id = result[0].owner_id
                                    data.id = result[0].id
                                    categories = data.categories.join('|')
                                    const sql = 'UPDATE Bill SET vendor = ?, bill_date = ?, due_date = ?, amount_due = ?, categories = ?, updated_ts = ?, paymentStatus = ? WHERE id = "'+putSingleID+'"'
                                    connection.query(sql, [data.vendor, data.bill_date, data.due_date, data.amount_due, categories, data.updated_ts, data.paymentStatus], (err,results) => {
                                        if(err){
                                            return res.status(400).send(err)
                                        }
                                        return res.status(200).send(data)
                                    })
                                }
                            }
                        })
                    }
                    else{
                        res.status(404).send({
                            "message" : "Please enter valid and correct credentials."
                        })
                    }
                }));
            }
        })
    }
}
                    

exports.delete_bill_id = (req, res) => {
    const authenticateUser = basicAuthentication(req)
    const deleteSingleId = req.params.id
    const basicAuthCheck = req.headers.authorization

    if(!basicAuthCheck) {
        return res.status(401).send({
            "message" : "Unauthorized Access"
        })
    }

    //check if the user has provided both email and password
    if(!authenticateUser.name || !authenticateUser.pass){
        return res.status(400).send({
            "message" : "Please provide email and password"
        })
    }

    //if both credentials given, check if the email exists in database, if it exists, check if the passwords match
    else{
        connection.query('SELECT * FROM UsersData where email_address = "'+authenticateUser.name+'"', (err, value) => {
            if(err){
                res.status(400).send(err)
            }
            else if(value.length == 0){
                res.status(400).send({
                    "message" : "No such email-id exists"
                })
            }
            else{
                if(bcrypt.compare(authenticateUser.pass, value[0].password).then(function(match) {
                    if(match){
                        connection.query('SELECT Bill.id FROM Bill INNER JOIN UsersData on Bill.owner_id = "'+value[0].id+'" AND Bill.id = "'+deleteSingleId+'"', (err, result) => {
                            if(err){
                                res.status(400).send(err)
                            }
                            else if(result.length == 0){
                                res.status(404).send({
                                    "message" : "No bills available for the requested ID"
                                })
                            }
                            else{
                                const sql = 'DELETE FROM Bill WHERE id = "'+deleteSingleId+'"'
                                connection.query(sql, (err, result) => {
                                    if(err){
                                        return res.status(400).send(err)
                                    }
                                    return res.status(204).send({
                                        "message" : "Deleted Successfully"
                                    })
                                })
                            }
                        })
                    }
                    else{
                        res.status(404).send({
                            "message" : "Please enter valid and correct credentials."
                        })
                    }
                }));
            }
        })
    }
}
var express = require('express');
var app = express();
var sql = require ('mssql');
var bodyParser = require('body-parser') //body parser is suppose to help to read req.body
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env]
var cors = require('cors')
const nodemailer = require('nodemailer');
const schemas = require('./schemas'); 
const middleware = require('./middleware'); 
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    bodyParser.json();
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});

// super admin get shelters: 

app.get('/api/admin-shelters',function(_,res){
    sql.connect(config.database).then((pool) => {
        pool.request().execute(`getAdminShelters`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/shelters',function(_,res){
    sql.connect(config.database).then((pool) => {
        pool.request().execute(`getAvailableShelters`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/all-shelters',function(_,res){
    sql.connect(config.database).then((pool) => {
        pool.request().execute(`getAllShelters`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/shelter-group/:id',function(req,res){
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('shelterId', sql.Int, Number(req.params.id))
        request.execute(`getShelterGroup`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/shelter-info/:id',function(req,res){
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('shelterId', sql.Int, Number(req.params.id))
        request.execute(`getShelterInfo`)
        .then(recordSet =>{
            res.json(recordSet.recordset[0]);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/groups',function(_,res){
    sql.connect(config.database).then((pool) => {
        pool.request().execute(`getEvacueeGroup`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

app.get('/api/groups/:id',function(req,res){
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('groupId', sql.Int, Number(req.params.id))
        request.execute(`getEvacuees`)
        .then(recordSet =>{
            res.json(recordSet.recordset);
        })
        .catch(err =>{
            console.log('query Error', err);
            res.statusCode = 400;
            res.json(err);
        });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.statusCode = 502;
        res.json(err);
    });
});

// super-admin open-close shelter:

app.put('/api/shelter', function(req,res){    
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('shelterId', sql.Int, Number(req.body.shelterId))
        request.execute(`toggleShelterHidden`)
                .then(recordSet =>{
                    res.statusCode = 200;
                    res.json(recordSet.recordsets);
            })
            .catch(err =>{
                console.log('query Error', err);
                res.statusCode = 400;
                res.json(err);
            });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.json(err);
        res.statusCode = 502; 
    });
});

app.put('/api/shelter-status', function(req,res){    
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('shelterId', sql.Int, Number(req.body.shelterId))
        request.input('shelterStatus', sql.VarChar, String(req.body.shelterStatus))
        request
            .execute(`updateShelterStatus`)
                .then(recordSet =>{
                    res.statusCode = 200;
                    res.json(recordSet.recordsets);
            })
            .catch(err =>{
                console.log('query Error', err);
                res.statusCode = 400;
                res.json(err);
            });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.json(err);
        res.statusCode = 502; 
    });
});

app.put('/api/group', function(req,res){    
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('groupId', sql.Int, Number(req.body.groupId))
        request
            .execute(`checkInEvacueeGroup`)
                .then(recordSet =>{
                    res.statusCode = 200;
                    res.json(recordSet.recordsets);
            })
            .catch(err =>{
                console.log('query Error', err);
                res.statusCode = 400;
                res.json(err);
            });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.json(err);
        res.statusCode = 502; 
    });
});

app.put('/api/uncheck-group', function(req,res){    
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.input('groupId', sql.Int, Number(req.body.groupId))
        request
            .execute(`unCheckInEvacueeGroup`)
                .then(recordSet =>{
                    res.statusCode = 200;
                    res.json(recordSet.recordsets);
            })
            .catch(err =>{
                console.log('query Error', err);
                res.statusCode = 400;
                res.json(err);
            });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.json(err);
        res.statusCode = 502; 
    });
});

app.put('/api/remove-group/:id', function(req,res){    
    sql.connect(config.database).then((pool) => {
        var request = pool.request();
        request.query(`UPDATE [GROUP] SET [Removed] = 'Y', Checked_in = NULL, Arrival_date = NULL WHERE 
        Group_id = ${req.params.id}`)
                .then(recordSet =>{
                    res.statusCode = 200;
                    res.json(recordSet.recordsets);
            })
            .catch(err =>{
                console.log('query Error', err);
                res.statusCode = 400;
                res.json(err);
            });
    }).catch(err =>{
        console.log('Connection Error', err);
        res.json(err);
        res.statusCode = 502; 
    });
});

app.post('/api/evacuee_group', middleware(schemas.evacueeGroupSchema), function(req,res){    
  sql.connect(config.database).then((pool) => {
      var request = pool.request();
      jsonObject = JSON.stringify(req.body.evacuees)
      request.input('shelterId', sql.Int, Number(req.body.shelterId))
      request.input('street', sql.VarChar, String(req.body.address.street)) 
      request.input('city', sql.VarChar, String(req.body.address.city)) 
      request.input('state', sql.VarChar, String(req.body.address.state)) 
      request.input('zip', sql.VarChar, String(req.body.address.zip)) 
      request.input('evacuees', sql.NVarChar, String(jsonObject))
          .execute('insertEvacueeGroup')
              .then(recordSet =>{
              sendEmail(recordSet.recordsets[0], recordSet.recordsets[1], recordSet.recordsets[2],
                recordSet.recordsets[3], recordSet.recordsets[4])
                .then((_) => {
                  //res.json(resp);
                  //res.statusCode = 200;
                  // add some log files 
                  // do require fs for the logs, fs = require(fs)
                })
                .catch(err => {res.json(err)});
                res.statusCode = 200;
                res.json(recordSet.recordsets[2][0]);
          })
          .catch(err =>{
              console.log('query Error', err);
              res.statusCode = 400;
              res.json(err);
          });
  }).catch(err =>{
      console.log('Connection Error', err);
      res.json(err);
      res.statusCode = 502; 
  });
});

function sendEmail(shelterName, shelterAddress, groupId, address, evacuees){
    return new Promise((resolve, reject) => {
  
    const htmlEvacuees = 
    `<ul>
        ${evacuees.map(evacuee => `<li> ${evacuee.firstName} ${evacuee.lastName} </li>`).join('')}
    </ul>`;

    const output = `
    <p>Dear ${evacuees[0].firstName}, you have been pre-registered for the <b>${shelterName[0].shelterName}</b> shelter in Hillsborough County. 
    The shelter address is <b>${shelterAddress[0].shelterAddress}</b></p>
    <h2>Your Group ID is <b>${groupId[0].groupId}</b></h2>
    <p>Please print this page and present your Group ID# to the shelter staff at check in.  
    <b>All members of your party <u>must be present</u></b> at the time of check in.</p>

    <p>Your home address is:</p>
    <p><b>${address[0].Street}, ${address[0].City}, ${address[0].State}, ${address[0].Zip}</b></p>
    <p>Total number of evacuees in your group (including yourself): <b>${evacuees.length}</b></p>`
    + htmlEvacuees + 
    `<p>Thank you.</p>`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'email@outlook.com', // generated ethereal user
        pass: 'password'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }});

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Hillsborough County" <email@outlook.com>', // sender address
        to: evacuees[0].Email, // list of receivers
        subject: 'Shelter Registration', // Subject line
        text: 'Plain text', // plain text body
        html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            reject(error);
        }
        else {
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            resolve('Your group has been registered. Email has been sent successfully!');
        }
    });
  })  
}

// for local use only:
/*var server = app.listen(3000, function () {
    console.log('Server is running..');
});*/

var server = app.listen(config.server, function () {
    console.log('Server is running..');
});
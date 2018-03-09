const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');
const mongoose = require('mongoose');

const Email = require('./server/models/email');

require('dotenv').config();

mongoose.connect(`mongodb://bdawie:${process.env.DB_PASS}@mongodb-atlas-shard-00-00-azmum.mongodb.net:27017,mongodb-atlas-shard-00-01-azmum.mongodb.net:27017,mongodb-atlas-shard-00-02-azmum.mongodb.net:27017/itrex-emails?ssl=true&replicaSet=mongodb-atlas-shard-0&authSource=admin`);

mongoose.Promise = global.Promise;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// Serving static files
app.use(express.static(path.join(__dirname,'dist')));
app.use(express.static(path.join(__dirname,'public')));

// Parse the body object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Middleware for allowing CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST, GET, PATCH, DELETE, PUT');
        return res.status(200).json({});
    }
    next();
});

// Return index.html for home route
app.use('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

// Return index.html for other routes
app.get('*',(req,res,next)=>{
    res.sendfile(path.join(__dirname,'dist/index.html'));
});

// WebSockets listening for connection event
io.on('connection',(socket)=>{ 
    console.log('new user connected!');
    Email.find({},(err,emails)=>{
        io.emit('get emails',emails);
    });  

    // Listening for an email submit on the client
    socket.on('email submit',(email)=>{
        // creating transporter
        let transporter = nodeMailer.createTransport(smtpTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            auth:{
                xoauth2 : xoauth2.createXOAuth2Generator({
                    user:process.env.USER,
                    clientId:process.env.CLIENT_ID,
                    clientSecret:process.env.CLIENT_SECRET,
                    refreshToken:process.env.REFRESH_TOKEN
                })
            }
        }));
        // Email options
        const mailOptions = {
            from:`${process.env.NAME} <${process.env.USER}>`,
            to:email.recipient,
            subject:email.subject,
            text:email.emailText
        }
        // Send the email
        transporter.sendMail(mailOptions,(err,respnse)=>{
            if(err){
                return console.log('Something went wrong', err);
            }
            console.log('Email sent successfully!');
        });
        const emailModel = new Email({
            recipient:email.recipient,
            subject:email.subject,
            emailText:email.emailText
        });
        emailModel.save((err,emailDoc)=>{
            if(err){
                return io.emit('error',{
                    error:err,
                    message:err.message
                });
            } 
            return io.emit('email saved', emailDoc);
        });
    });
    socket.on('email delete',(email)=>{
        console.log(email);
        Email.findByIdAndRemove(email._id)
        .exec()
        .then(removedEmail=>{
            console.log('Email removed', removedEmail);
        })
        .catch(err=>{
            console.log('Failed to remove the Email');
        });
    });
});

// run the server and listening for requests on a specified port
server.listen(port,()=>{
    console.log('Server started...');
});
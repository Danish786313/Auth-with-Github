require('dotenv').config()
const express = require('express');
const app = express();
const request = require('request');
const superagent = require('superagent');
const port = 9701;
const cors = require('cors');
app.use(cors());

app.get('/',(req,res) => {
        res.send(`<a href="https://github.com/login/oauth/authorize?client_id=${process.env.client_id}">Login With Git</a>`)
})

app.get('/profile',(req,res) => {
    const code = req.query.code;
    if(!code){
        res.send({
            success:false,
            message: 'Error While Login'
        })
    }
    superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id:'',
            client_secret:'',
            code:code
        })
        .set('Accept','application/json')
        .end((err,result) => {
            if(err) throw err;
            let access_token = result.body.access_token;
            const option = {
                uri:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept': 'application/json',
                    'Authorization':`token ${access_token}`,
                    'User-Agent':'mycode'
                }
            }
            request(option,(err,response,body) => {
                res.send(body)
            })
        })
})
app.use("/home", (req, res) => {
    res.status(200).json({
        message: "Hello you are in home page"
    })
})

app.listen(port,() => {
    console.log(`listening on port ${port}`)
})
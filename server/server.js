/*
    Spotify API Token server     
    This specific application takes the client id and secret client
    offered by spotify, to get the token through a request
    POST from the front end.

*/

const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/spotify/:client_id/:client_secret', (req, resp) => {

    let client_id = req.params.client_id;
    let client_secret = req.params.client_secret;
    let spotifyUrl = 'https://accounts.spotify.com/api/token';

    var authOptions = {
        url: spotifyUrl,
        headers: {
            Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, (err, httpResponse, body) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'The token could not be obtained',
                err
            })
        }
        resp.json(body);
    });
});


app.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Server running in port ${port}`);
});
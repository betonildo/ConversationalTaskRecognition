"use strict";

const express = require("express");
const app = express();


app.use(express.static("build/"));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, () => {
    console.log( "Listening on " + server_ip_address + ", port " + server_port );
});
const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), './.env')});
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const QueueService = require('./queue_service');
// Middleware
app.use(bodyParser.json());

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

// handle the request
app.post('/api/v1/processData', async function (req, res) {
        
    // connect to Rabbit MQ and create a channel
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createConfirmChannel();
    let requestBody = req.body;
    console.log(requestBody)

    // start timer
    var time = Date.now();
    requestBody.time = time;

    let acked = await QueueService.sendToQueue(channel, { 
        queue: process.env.SEND_TO_QUEUE,
        data: requestBody
    });
    console.log(acked)

    channel.close();
    connection.close();

    res.send("Message sent to MS1");
});

// Start the server
const PORT = 4000;
server = http.createServer(app);
server.listen(PORT, "0.0.0.0", function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info("Listening on port %s.", PORT);
  }
});


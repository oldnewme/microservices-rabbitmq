const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), './.env')});
const QueueService = require('./queue_service');

function handleData(msg) {
    let msgBody = msg.content.toString();
    let data = JSON.parse(msgBody);
    console.log("Sent: " + JSON.stringify(data) + " to "+ process.env.SEND_TO_QUEUE)
    return data;
}

let config = {
    worker:handleData,
    listenToQueue: process.env.LISTEN_TO_QUEUE,
    sendToQueue:process.env.SEND_TO_QUEUE,
    messageQueueConnectionString:process.env.CLOUDAMQP_URL
    
}

QueueService.listenToQueue(config);
console.log(process.env.LISTEN_TO_QUEUE + ":" + process.env.SEND_TO_QUEUE) 
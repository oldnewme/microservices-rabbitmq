const amqp = require('amqplib');

// Connect to rabbitmq server

class QueueService {

      static async listenToQueue(config){
        let connection = await amqp.connect(config.messageQueueConnectionString);
        let channel = await connection.createChannel();
        await channel.prefetch(1);
        await this.consumeQueue(connection, channel, {config});
        console.log("Consumer started")
      }

      static async consumeQueue(connection, channel, {config}){
        return new Promise((resolve, reject) => {
          channel.consume(config.listenToQueue, async function (msg) {
            config.worker(msg);
            await channel.ack(msg);
            }
          );

          // handle connection closed
          connection.on("close", (err) => {
            return reject(err);
          });
      
          // handle errors
          connection.on("error", (err) => {
            return reject(err);
          });

          resolve("a")

        });
      }

      static async sendToQueue(channel, { queue, data }) {
        return new Promise((resolve, reject) => {
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
            if (err) {
              return reject(err);
            }
            resolve('Message sent');
          })
        });
      }
}

module.exports = QueueService;
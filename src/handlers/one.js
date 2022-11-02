/**
 * A Lambda function 
 * 
 * one.js: this receives a message from an SQS queue and puts the data onto another SQS queue
 * where the URL is in the process.env.ONE_QUEUE_URL environment variable
 */

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const client = new SQSClient();
// just for fun
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // run the function
    eventJSON = JSON.stringify(event, null, 2);
    console.log("EVENT (one): \n" + eventJSON);

    try {
        console.log("ONE_QUEUE_URL: " + process.env.ONE_QUEUE_URL);

        randomString = "one-" + Math.floor(Math.random() * 10000000) + "-" + context.awsRequestId;

        console.log("Creating " + randomString);

        data = {
            randomString: randomString,
            // create a hex digest of the event received (because why not?)
            hash: crypto.createHmac('sha256', JSON.stringify(eventJSON)).digest('hex')
        }

        console.log("data: " + JSON.stringify(data));

        // create a params
        let params = {
            QueueUrl: process.env.ONE_QUEUE_URL,
            MessageBody: JSON.stringify(data)
        };

        console.log("(SEND MESSAGE PARAMS): " + JSON.stringify(params, null, 2));

        const command = new SendMessageCommand(params);

        console.log(command);

        const response = await client.send(command);

        console.log("(SEND MESSAGE RESPONSE): " + JSON.stringify(response, null, 2))

    } catch(e) {
        // need to return a success because this is a test
        // and it isn't something we want to worry about
        console.log("EVENT (one): error");
        console.log(e);
    }

    return true;
}

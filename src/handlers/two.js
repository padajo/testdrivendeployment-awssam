/**
 * A Lambda function 
 * 
 * two.js: this receives a trigger from S3 to say an object has been created and sends
 * the data in their to DynamoDB with the key as the ID
 */
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient();

exports.handler = async (event, context) => {
    // run the function
    eventJSON = JSON.stringify(event, null, 2);
    console.log("EVENT (two): \n" + eventJSON);

    try {
        console.log("DYNAMODB_TABLE: " + process.env.DYNAMODB_TABLE);
        console.log("DYNAMODB_TABLE_ARN: " + process.env.DYNAMODB_TABLE_ARN);

        let rand1000 = Math.floor(Math.random() * 1000); // get a random number between 1 and 1000

        let params = {
            Item: {
                "Id": {"S": "two-" + context.awsRequestId}, // this is the format of a DynamoDB Item
                "RandomNumber": {"N": rand1000.toString()}
            },
            TableName: process.env.DYNAMODB_TABLE
        };

        console.log("(PUT ITEM PARAMS): " + JSON.stringify(params, null, 2));

        const command = new PutItemCommand(params);

        const response = await client.send(command);

        console.log("(PUT ITEM RESPONSE): " + JSON.stringify(response, null, 2))
    } catch(e) {
        // need to return a success because this is a test
        // and it isn't something we want to worry about
        console.log("EVENT (two): error");
        console.log(e);
    }

    return true;
}

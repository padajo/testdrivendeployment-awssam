/**
 * A Lambda function 
 * 
 * three.js: this receives an Item from a DynamoDB Stream. This is the end of the processing of this
 * proof of concept.
 */
exports.handler = async (event, context) => {
    // run the function
    eventJSON = JSON.stringify(event, null, 2);
    console.log("EVENT (three): \n" + eventJSON);

    console.log('Finished');

    return true;
}

/**
 * A Lambda function that handles a test deployment event
 */
exports.testHandler = async (event, context) => {
    eventJSON = JSON.stringify(event, null, 2);
    console.log("EVENT (test-begin): \n" + eventJSON);

    // DO SET UP IN HERE
    console.log("STACK: " + process.env.STACK_TO_TEST_ARN);

    let testSuccess = true;

    return testSuccess;
}

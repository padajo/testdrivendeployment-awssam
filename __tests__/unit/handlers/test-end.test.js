// Import all functions from test-end.js
const lambda = require('../../../src/lambda2/test-end.js');

// This includes all tests for testHandler()
describe('Test for test-end', function () {
    // This test invokes testHandler() and compare the result 
    it('Verifies successful response', async () => {
        // Invoke testHandler()
        const result = await lambda.testHandler();
        const expectedResult = true;
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});

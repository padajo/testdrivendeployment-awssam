// Import all functions from test-begin.js
const lambda = require('../../../src/handlers/two.js');

// This includes all tests for testHandler()
describe('Test for test-begin', function () {
    // This test invokes testHandler() and compare the result 
    it('Verifies successful response', async () => {
        // Invoke testHandler()
        const result = await lambda.testHandler();
        const expectedResult = true;
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});

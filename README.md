# Test Driven Deployment - Proof of Concept

This is a proof of concept that contains two SAM/CloudFormation stacks.

## The Workload Stack

The **Workload Stack** contains 3 Lambda functions, a couple of SQS queues and DynamoDB Table. It is simply an example stack, and the functions within it are not production ready or tested.

The **Workload Stack** is described in [**template.yaml**](./template.yaml).

Data moves through the stack in an event-driven way through the resources like this:

```
"Zero" SQS Queue is the ingestion point for the data processing

"Zero" SQS Queue -> (SQS poller message event) -> "One" Lambda Function

"One" Lambda Function -> Sends message using AWS SDK to "One" SQS Queue

"One" SQS Queue -> (SQS poller message event) -> "Two" Lambda Function

"Two" Lambda Function -> Sends message using AWS SDK to "Two" DynamoDB Table

"Two" DynamoDB Table -> (DynamoDB Streams event) -> "Three" Lambda Function

"Three" Lambda Function invocation completes the data processing
```

To put it another way:

```
SQS -> Lambda 1 -> SQS -> Lambda 2 -> DynamoDB Table -> Lambda 3
```

## The Test Stack

The **Test Stack** contains 2 Lambda functions and an EventBridge Rule and associated permissions for that rule. 

The Test Stack requires a parameter that is the ARN of the **Workload Stack**. This is one of the inputs to the EventBridge Rule, and should mean that the EventBridge Rule is only triggered when the Workload Stack is updated or created, and not any other stack. Have a look at the CloudFormation in the file for more information.

For more information on how to deploy EventBridge rules with SAM look at [Using Amazon EventBridge and AWS Serverless Application Model templates](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-sam.html#eb-separated-template). 

To test out how EventBridge works with AWS Lambda using a schedule instead of an event have a look at [Tutorial: Schedule AWS Lambda functions using EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-run-lambda-schedule.html). 

The **Test Stack** is described in [**test-template.yaml**](./test-template.yaml).

There are two functions in the Test Stack: `TestBeginLambdaFunction` and `TestEndLambdaFunction`. The `TestBeginLambdaFunction` is the one that is targeted by the event in the EventBridge Rule. The `TestEndLambdaFunction` currently has no invocation within the code or template.

This is a barebones system that is intended to be developed.

## How to use this system

The idea is that the **Workload Stack** should be deployed as an empty stack initially, and the **Test Stack** should be deployed as a stack linked directly and only to one **Workload Stack**.

Then, on every update to the **Workload Stack** the **Test Stack** will trigger the `TestBeginLambdaFunction`. 

What this means is that on any `CREATE_COMPLETE` or `UPDATE_COMPLETE` of a **Workload Stack** as the proof of concept is written, the **Test Stack** could run a set of tests against that stack.

This could be specific end-to-end tests so for example in the above system, the **Test Stack** could create an event listener for SQS messages on the SQS Queues and DynamoDB table, that are disabled. The `TestBeginLambdaFunction` could enable them, run a test event through the system, and then either after a few seconds or, on completion, disable the event listeners.

[Other events that CloudFormation provides](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks-event-bridge.html) include resource based events, so if the tests wanted to check for specific updates to a Lambda function for example, that could also be tested.

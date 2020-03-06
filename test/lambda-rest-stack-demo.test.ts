import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import LambdaRestStackDemo = require('../lib/lambda-rest-stack-demo-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaRestStackDemo.LambdaRestStackDemoStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

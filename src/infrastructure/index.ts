#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaRestStackDemoStack } from './stack';

const app = new cdk.App();

new LambdaRestStackDemoStack(app, 'LambdaRestStackDemoStack');

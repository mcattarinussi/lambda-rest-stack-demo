#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaRestStackDemoStack } from './stack';

new LambdaRestStackDemoStack(new cdk.App());

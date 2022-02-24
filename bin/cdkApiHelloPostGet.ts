#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { cdkApiHelloPostGet } from '../lib/cdkApiHelloPostGet-stack';

const app = new cdk.App();
new cdkApiHelloPostGet(app, 'cdkApiHelloPostGet');

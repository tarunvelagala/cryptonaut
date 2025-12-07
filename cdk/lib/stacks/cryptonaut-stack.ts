import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CryptonautStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}

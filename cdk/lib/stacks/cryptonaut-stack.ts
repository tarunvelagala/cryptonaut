import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class CryptonautStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Path to the lambdas directory
    const lambdasPath = path.join(__dirname, '..', '..', '..', 'lambdas');

    // Lambda 1
    new Function(this, 'Lambda1', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(lambdasPath),
      handler: 'lambda1.handler.handler',
      functionName: 'cryptonaut-lambda1',
    });

    // Lambda 2
    new Function(this, 'Lambda2', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(lambdasPath),
      handler: 'lambda2.handler.handler',
      functionName: 'cryptonaut-lambda2',
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import { Runtime, Function, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import { AuditTable } from '../constructs/audit-table';
import { AppSecrets } from '../constructs/app-secrets';
import { AppConfig } from '../constructs/app-config';

export class CryptonautStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Path to the lambdas directory
    const lambdasPath = path.join(__dirname, '..', '..', '..', 'lambdas');

    // Constructs
    const auditTable = new AuditTable(this, 'AuditTable');
    const appSecrets = new AppSecrets(this, 'AppSecrets', {
      telegramBotToken: 'REPLACE_WITH_REAL_TOKEN',
      crewAiApiKey: 'REPLACE_WITH_REAL_KEY',
    });
    const appConfig = new AppConfig(this, 'AppConfig');

    // Lambda 1
    new Function(this, 'Lambda1', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(lambdasPath),
      handler: 'lambda1.handler.handler',
      functionName: 'cryptonaut-lambda1',
      environment: {
        AUDIT_TABLE: auditTable.table.tableName,
      },
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

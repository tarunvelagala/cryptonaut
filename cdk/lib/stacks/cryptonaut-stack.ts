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
      telegramBotToken: '8088622681:AAH-3uqsijzF2AGxp22Qln3gqOpzSuOHN5s',
      crewAiApiKey:
        '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',
    });
    const appConfig = new AppConfig(this, 'AppConfig');

    // Lambda Functions

    // A. Crew Orchestrator
    const orchestratorLambda = new Function(this, 'CrewOrchestrator', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(lambdasPath, 'orchestrator')),
      handler: 'main.handler',
      functionName: 'cryptonaut-orchestrator',
      environment: {
        AUDIT_TABLE: auditTable.table.tableName,
        APPCONFIG_APP_ID: appConfig.applicationId,
        APPCONFIG_ENV_ID: appConfig.environmentId,
        APPCONFIG_PROFILE_ID: appConfig.configProfileId,
        CREWAI_SECRET_NAME: appSecrets.crewAiSecret.secretName,
      },
      timeout: cdk.Duration.seconds(60),
    });

    // B. Telegram Notifier
    const notifierLambda = new Function(this, 'TelegramNotifier', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(lambdasPath, 'notifier')),
      handler: 'main.handler',
      functionName: 'cryptonaut-notifier',
      environment: {
        AUDIT_TABLE: auditTable.table.tableName,
        TELEGRAM_SECRET_NAME: appSecrets.telegramBotSecret.secretName,
      },
    });

    // C. Telegram Webhook (API Handler)
    const webhookLambda = new Function(this, 'TelegramWebhook', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(lambdasPath, 'webhook')),
      handler: 'main.handler',
      functionName: 'cryptonaut-webhook',
      environment: {
        AUDIT_TABLE: auditTable.table.tableName,
        TELEGRAM_SECRET_NAME: appSecrets.telegramBotSecret.secretName,
      },
    });

    // D. Portfolio Engine
    const portfolioLambda = new Function(this, 'PortfolioEngine', {
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(lambdasPath, 'portfolio')),
      handler: 'main.handler',
      functionName: 'cryptonaut-portfolio',
      environment: {
        AUDIT_TABLE: auditTable.table.tableName,
        APPCONFIG_APP_ID: appConfig.applicationId,
        APPCONFIG_ENV_ID: appConfig.environmentId,
        APPCONFIG_PROFILE_ID: appConfig.configProfileId,
      },
    });

    // IAM Permissions

    // Orchestrator: Write to DynamoDB, Read CrewAI Secret, Invoke Notifier, Access AppConfig
    auditTable.table.grantWriteData(orchestratorLambda);
    appSecrets.crewAiSecret.grantRead(orchestratorLambda);
    notifierLambda.grantInvoke(orchestratorLambda);
    orchestratorLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['appconfig:GetLatestConfiguration', 'appconfig:StartConfigurationSession'],
        resources: [
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}`,
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}/environment/${appConfig.environmentId}`,
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}/configurationprofile/${appConfig.configProfileId}`,
        ],
      }),
    );

    // Notifier: Write to DynamoDB, Read Telegram Secret
    auditTable.table.grantWriteData(notifierLambda);
    appSecrets.telegramBotSecret.grantRead(notifierLambda);

    // Webhook: Read/Write DynamoDB, Read Telegram Secret
    auditTable.table.grantReadWriteData(webhookLambda);
    appSecrets.telegramBotSecret.grantRead(webhookLambda);

    // Portfolio: Read DynamoDB, Access AppConfig
    auditTable.table.grantReadData(portfolioLambda);
    portfolioLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['appconfig:GetLatestConfiguration', 'appconfig:StartConfigurationSession'],
        resources: [
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}`,
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}/environment/${appConfig.environmentId}`,
          `arn:aws:appconfig:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:application/${appConfig.applicationId}/configurationprofile/${appConfig.configProfileId}`,
        ],
      }),
    );
  }
}

import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface AppSecretsProps {
    telegramBotToken: string;
    crewAiApiKey: string;
}

/**
 * AppSecrets construct manages Secrets Manager resources for Cryptonaut.
 */
export class AppSecrets extends Construct {
    readonly telegramBotSecret: Secret;
    readonly crewAiSecret: Secret;

    constructor(scope: Construct, id: string, props: AppSecretsProps) {
        super(scope, id);

        this.telegramBotSecret = new Secret(this, 'TelegramBotSecret', {
            secretName: 'cryptonaut/telegram-bot',
            description: 'Telegram Bot Token. Content: {"token": "123:ABC..."}',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ token: props.telegramBotToken }),
                generateStringKey: 'ignored',
            },
        });

        this.crewAiSecret = new Secret(this, 'CrewAiSecret', {
            secretName: 'cryptonaut/crewai-key',
            description: 'CrewAI API Key. Content: {"key": "sk-..."}',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ key: props.crewAiApiKey }),
                generateStringKey: 'ignored',
            },
        });
    }
}

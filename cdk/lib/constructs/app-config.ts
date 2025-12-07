import { CfnApplication, CfnConfigurationProfile, CfnEnvironment } from 'aws-cdk-lib/aws-appconfig';
import { Construct } from 'constructs';

/**
 * AppConfig construct for managing application configuration.
 * Sets up Application, Environment (production), and a Hosted Configuration Profile.
 */
export class AppConfig extends Construct {
    public readonly applicationId: string;
    public readonly environmentId: string;
    public readonly configProfileId: string;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // 1. Application
        const app = new CfnApplication(this, 'CryptonautApp', {
            name: 'cryptonaut-app',
            description: 'Configuration for Cryptonaut CrewAI Agents',
        });
        this.applicationId = app.ref;

        // 2. Environment
        const env = new CfnEnvironment(this, 'CryptonautEnv', {
            applicationId: app.ref,
            name: 'production',
            description: 'Production Environment',
        });
        this.environmentId = env.ref;

        // 3. Configuration Profile (Hosted)
        const profile = new CfnConfigurationProfile(this, 'CryptonautProfile', {
            applicationId: app.ref,
            name: 'cryptonaut-profile',
            locationUri: 'hosted',
            type: 'AWS.Freeform',
            description: 'Main configuration profile',
        });
        this.configProfileId = profile.ref;
    }
}

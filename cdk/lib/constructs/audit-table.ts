import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class AuditTable extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(this, 'CryptonautAudit', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });
  }
}

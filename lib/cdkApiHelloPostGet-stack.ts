import { aws_apigateway, aws_lambda, aws_lambda_nodejs, CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { todoTableName } from './variables';

export class cdkApiHelloPostGet extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ------------------ DYNAMODB ----------------- //
    // -- create table
    const todoTable = new Table(this, 'todoTable', {
      tableName: 'dbProvaApiCrudGetPost',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      removalPolicy: RemovalPolicy.DESTROY
    });
         
    new CfnOutput(this, 'todoTableName', {
      value: todoTable.tableName
    });

    // -- SECTION CRUD TO HANDLER DYNAMODB
    const crudTodoFn = new NodejsFunction(this, 'crudTodoFn', {
      runtime: Runtime.NODEJS_14_X,
      entry: `${__dirname}/../lambda/crud/index.ts`,
      handler: 'crudTodo',
      architecture: Architecture.ARM_64,
      environment: {
        TODO_TABLE_NAME: todoTableName
      },
    })
    // section role
    todoTable.grantReadWriteData(crudTodoFn)
    // ------------------------------------------ //  

    // -- section ApiGateway
    new aws_apigateway.LambdaRestApi(this,'EndpointApiCrud',{
      handler: crudTodoFn,
      restApiName: "crud"
    })

    

  }
}

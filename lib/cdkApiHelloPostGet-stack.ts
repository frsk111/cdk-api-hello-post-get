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
    // -- parte di creazione tabella
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

    // -- parte di inserimento dati in tabella (CREATE)
    const createTodoFn = new NodejsFunction(this, 'createTodoFn', {
      runtime: Runtime.NODEJS_14_X,
      entry: `${__dirname}/../lambda/create/index.ts`,
      handler: 'createTodo',
      environment: {
       TODO_TABLE_NAME: todoTable.tableName
      }
    });    
    // autorizzazioni ruoli
    todoTable.grantReadWriteData(createTodoFn)

    // -- parte di aggiornamento dati in tabella (UPDATE)
    const updateTodoFn = new NodejsFunction(this, 'updateTodoFn', {
      runtime: Runtime.NODEJS_14_X,
      entry: `${__dirname}/../lambda/update/index.ts`,
      handler: 'updateTodo',
      architecture: Architecture.ARM_64,
      environment: {
        TODO_TABLE_NAME: todoTableName
      }
    })

    todoTable.grantReadWriteData(updateTodoFn)
    // ------------------------------------------ //

    // -- parte di CRUD dati in tabella (CRUD)
    const crudTodoFn = new NodejsFunction(this, 'crudTodoFn', {
      runtime: Runtime.NODEJS_14_X,
      entry: `${__dirname}/../lambda/crud/index.ts`,
      handler: 'crudTodo',
      architecture: Architecture.ARM_64,
      environment: {
        TODO_TABLE_NAME: todoTable.tableName
      },
    })

    todoTable.grantReadWriteData(crudTodoFn)
    // ------------------------------------------ //
    
    new aws_apigateway.LambdaRestApi(this,'EndpointApiCrudGetPost',{
      handler: createTodoFn
    })

    new aws_apigateway.LambdaRestApi(this,'EndpointApiUpdate',{
      handler: updateTodoFn
    })

    new aws_apigateway.LambdaRestApi(this,'EndpointApiCrud',{
      handler: crudTodoFn,
      restApiName: "crud111"
    })

    

  }
}

import { aws_apigateway, aws_lambda, aws_lambda_nodejs, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class cdkApiHelloPostGet extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const hello = new aws_lambda_nodejs.NodejsFunction(this,"HelloHandler",{
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      entry: 'lambda/hello.ts',
      handler: 'handler'
    })

    new aws_apigateway.LambdaRestApi(this,'Endpoint',{
      handler: hello
    })

  }
}

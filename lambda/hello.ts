import { APIGatewayProxyHandler } from 'aws-lambda';
import { error } from 'console';

export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: `Hello, CDK NEWWW, CIAO CIAO, bye bye -cdkApiHelloPostGet------ ?!?!?!!? ! You have hit ${event.path}\n`
  };
};

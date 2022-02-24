import { APIGatewayProxyHandler } from 'aws-lambda';
import { error } from 'console';

export const handler: APIGatewayProxyHandler = async (event) => {
  
  // if (event.httpMethod === "POST") {
  //   let request = JSON.parse(event);
  //   let username = request.username;
  //   let department = request.department;
  //   let departmentName = department.departmentName;

  //   let user = { username: username, departmentName: departmentName };
  //   const response = {
  //     statusCode: 200,
  //     body: JSON.stringify(user),
  //   };
  //   return response;
  // }

  // if (`${event.httpMethod}` === "GET") {
  //   let response = {
  //     statusCode: 200,
  //     body: `Hello Welcome to CDK`,
  //   };
  //   return response;
  // }
  
  // test per il GET
  // let response = JSON.stringify(event.queryStringParameters);
  // let dato1 = JSON.parse(response)
  // let data = dato1.qwerty;

  // test per il POST
  let body = JSON.stringify(event.body);
  let requestBis = JSON.parse(body)

  let request = JSON.parse(requestBis)

  let nome = request.nome;
  let cognome = request.cognome;
  let luogo = request.luogo;


  
  
  
  return {
    statusCode: 200,
    body: `Hello, CDK NEWWW, CIAO CIAO, bye bye -cdkApiHelloPostGet------ ?!?!?!!? ! You have hit ${event.httpMethod}\n = ${nome},  ${cognome}, ${luogo}\n, ${body}\n, ${requestBis}\n, ${request}\n`
  };
};

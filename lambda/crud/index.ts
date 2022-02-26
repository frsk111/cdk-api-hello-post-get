import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTodo, updateTodo, deleteTodo, getAll, getOne } from './base';

export async function crudTodo(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {    
         
    let operApi:any;   

    if(event.httpMethod === "POST") {        
        operApi = createTodo(event);  
    }
    if(event.httpMethod === "PUT") {        
        operApi = updateTodo(event);  
    }
    if(event.httpMethod === "DELETE") {        
        operApi = deleteTodo(event);   
    }
    if(event.httpMethod === "GET" && event.queryStringParameters) {        
        operApi = getOne(event);        
    }
    if(event.httpMethod === "GET" && !event.queryStringParameters) {        
        operApi = getAll();
    }   

    return operApi;          

}

function sendFail(message: string): APIGatewayProxyResult {    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}


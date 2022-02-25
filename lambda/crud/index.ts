import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTodo, updateTodo, deleteTodo, getAll } from './base';

export async function crudTodo(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {    
    const { body } = event
    if (!body) {
        return sendFail('invalid request: body undefined !')
    }
    else
    {        
        let operApi:any;
        switch(event.httpMethod) { 
            case "POST": { 
               operApi = createTodo(body);  
               break; 
            } 
            case "PUT": { 
               operApi = updateTodo(body);  
               break; 
            } 
            case "DELETE": { 
                operApi = deleteTodo(body);  
                break; 
            }
            case "GET": { 
                operApi = getAll();
                break; 
            }  

            default: { 
               //statements; 
               break; 
            } 
        }        
        return operApi;        
    }
}

function sendFail(message: string): APIGatewayProxyResult {    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}


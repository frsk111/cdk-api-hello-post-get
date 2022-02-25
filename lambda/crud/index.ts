import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTodo, updateTodo, deleteTodo, getAll, getOne } from './base';

export async function crudTodo(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {    
         
    let operApi:any;
    // let operApiGet:any;
    // if(event.httpMethod === "GET") {        
    //     if (event.queryStringParameters){ operApiGet = getOne(event); }
    //     else { operApiGet = getAll(); }   
    //     console.log(operApiGet); 
    // }
   

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
    
    // switch(event.httpMethod) { 
    //     case "POST": { 
    //         operApi = createTodo(event);  
    //         break; 
    //     } 
    //     case "PUT": { 
    //         operApi = updateTodo(event);  
    //         break; 
    //     } 
    //     case "DELETE": { 
    //         operApi = deleteTodo(event);  
    //         break; 
    //     }
    //     case "GET": { 
    //         if (event.queryStringParameters){ 
    //           operApi =getOne(event); 
    //         }
    //         else 
    //         { 
    //           operApi = getAll();
    //         }             
    //         break; 
    //     }  
    //     default: { 
    //         return sendFail('error with http method')
    //         break; 
    //     } 
    // }

    return operApi;          

}

function sendFail(message: string): APIGatewayProxyResult {    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}


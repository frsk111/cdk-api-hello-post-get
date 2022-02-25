import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, PutItemInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { v4 as uuid } from 'uuid'

interface TodoInput {
    id?: string
    nome: string
    cognome: string 
    luogo: string
}

interface Todo {
    id: string
    nome: string
    cognome: string,
    luogo: string 
}

export async function crudTodo(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    const { body } = event

    if (!body) {

        return sendFail('invalid request !!!????!!')
    }
    else
    {
        const { id, nome, cognome, luogo } = JSON.parse(body) as TodoInput
        const dynamoClient = new DynamoDB({ 
            region: 'us-east-1' 
        })

        const newTodo: Todo = {
            id: id ?? uuid(),
            nome, cognome, luogo
        }

        const todoParams: PutItemInput = {
            Item: marshall(newTodo),
            TableName: process.env.TODO_TABLE_NAME
        }

        try {

            await dynamoClient.putItem(todoParams)
                
            return {
                statusCode: 200,
                //body: JSON.stringify({ newTodo })   
                body: `Hello, CDK NEWWW, CIAO CIAO, bye bye -cdkApiHelloPostGet------ ?!?!?!!? ! You have hit ${event.httpMethod}\n` 
            }
        
        } catch (err) {
        
            console.log(err)
        
            return sendFail('something went wrong')
        }
    }

   
}

function sendFail(message: string): APIGatewayProxyResult {
    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB, PutItemInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { v4 as uuid } from 'uuid'

interface TodoInput {
    id?: string
    nome: string
    cognome: string 
    luogo: number
}

interface Todo {
    id: string
    nome: string
    cognome: string,
    luogo: number 
}

export async function createTodo(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {

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
                body: JSON.stringify({ newTodo })   
                //body: `Hello, CDK NEWWW, CIAO CIAO, bye bye -cdkApiHelloPostGet------ ?!?!?!!? ! You have hit ${JSON.stringify({ newTodo })}\n` 
            }
        
        } catch (err) {
        
            console.log(err)
        
            return sendFail('something went wrong')
        }
    }

   
}

function sendFail(message: string): APIGatewayProxyResultV2 {
    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}
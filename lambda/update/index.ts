import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB, UpdateItemInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

interface UpdateTodo {
    id: string
    nome: string
    cognome: string 
    luogo: string
}

export async function updateTodo(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {

    const { body } = event

    if (!body) {
        return sendFail('invalid request')
    }
    else
    {
        const { id, nome } = JSON.parse(body) as UpdateTodo
        const dynamoClient = new DynamoDB({ 
            region: 'us-east-1' 
        });
        const todoParams: UpdateItemInput = {
            Key: marshall({ id }),
            UpdateExpression: 'set nome = :nome',
            ExpressionAttributeValues: marshall({
                ':nome': nome
            }),
            ReturnValues: 'ALL_NEW',
            TableName: process.env.TODO_TABLE_NAME
        };
        try {
            const { Attributes } = await dynamoClient.updateItem(todoParams)
            const todo = Attributes ? unmarshall(Attributes) : null        
            return {
                statusCode: 200,
                body: JSON.stringify({ todo })    
            }

        } catch (err) {
            console.log(err)
            return sendFail('something went wrong')
        }
    }
}

function sendFail(message: string): APIGatewayProxyResultV2 {    
    return {
        statusCode: 200,
        body: JSON.stringify({ message })
    }
}
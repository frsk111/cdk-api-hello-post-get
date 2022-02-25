import { APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemInput, DynamoDB, GetItemInput, PutItemInput, ScanInput, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuid } from 'uuid';

interface CreateInputInterface {
    id?: string
    nome: string
    cognome: string 
    luogo: string
}

interface CreateDto {
    id: string
    nome: string
    cognome: string,
    luogo: string 
}

interface UpdateInputInterface {
    id: string
    nome: string
    cognome: string 
    luogo: string
}

interface DeleteInputInterface {
    id: string
}

interface GetInputInterface {
    id: string
}


export async function createTodo(event: any){

    const { body } = event
    if (!body) {
        return sendFail('invalid request: body undefined !')
    }    

    const { id, nome, cognome, luogo } = JSON.parse(body) as CreateInputInterface
    const dynamoClient = new DynamoDB({ 
        region: 'us-east-1' 
    })

    const newTodo: CreateDto = {
        id: id ?? uuid(),
        nome, cognome, luogo
    }

    const todoParams: PutItemInput = {
        Item: marshall(newTodo),
        TableName: process.env.TODO_TABLE_NAME
    }

    try {
        await dynamoClient.putItem(todoParams);        
        return {
            statusCode: 200,
            body: JSON.stringify({ newTodo })                      
        }
    } catch (err) {
        console.log(err)
        return sendFail('something went wrong')
    }
};

export async function updateTodo(event: any) {

    const { body } = event
    if (!body) {
        return sendFail('invalid request: body undefined !')
    }

    const { id, nome, cognome, luogo } = JSON.parse(body) as UpdateInputInterface
    const dynamoClient = new DynamoDB({ 
        region: 'us-east-1' 
    });
    const todoParams: UpdateItemInput = {
        Key: marshall({ id }),
        UpdateExpression: 'set nome = :nome, cognome= :cognome, luogo = :luogo',
        ConditionExpression: 'attribute_exists(id)',
        ExpressionAttributeValues: marshall({
        ':nome': nome,
        ':cognome': cognome,
        ':luogo': luogo,  
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
            //body: `UPDATETODO --> ! ${httpMetod}\n`    
        }
    } catch (err) {
        console.log(err)
        return sendFail('something went wrong')
    }
}

export async function deleteTodo(event: any) {
    const { body } = event
    if (!body) {
        return sendFail('invalid request: body undefined !')
    }
    const { id } = JSON.parse(body) as DeleteInputInterface
    const dynamoClient = new DynamoDB({ 
        region: 'us-east-1' 
    })
    const todoParams: DeleteItemInput = {
        Key: marshall({ id }),
        ReturnValues: 'ALL_OLD',
        TableName: process.env.TODO_TABLE_NAME
    }
    try {
        const { Attributes } = await dynamoClient.deleteItem(todoParams)
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

//export async function getTodo(body: any) {
export async function getAll() {
    const dynamoClient = new DynamoDB({ 
        region: 'us-east-1' 
    });
    const scanTodo: ScanInput = {
        TableName: process.env.TODO_TABLE_NAME
    };
    try {
        const { Items } = await dynamoClient.scan(scanTodo);
        const userData = Items ? Items.map(item => unmarshall(item)) : [];
        return {
            statusCode: 200,
            body: JSON.stringify({ listTodo: userData})
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'something went wrong'
            })
        }
    }    
}

export async function getOne(event: any) {  
    //return sendFail(event) 
    const { queryStringParameters } = event;   
    //return sendFail(queryStringParameters.id);
    if (!queryStringParameters){return sendFail('invalid request')};    
       
    
    const dynamoClient = new DynamoDB({ 
        region: 'us-east-1' 
    });
    const getTodo: GetItemInput = {
        Key: marshall({
            id: queryStringParameters.id
        }),
        TableName: process.env.TODO_TABLE_NAME
    };    
    try {
        const { Item } = await dynamoClient.getItem(getTodo);
        const todo = Item ? unmarshall(Item) : null;
        return {
            statusCode: 200,
            body: JSON.stringify({ todo })
        };
    } catch (err) {
        console.log(err);
        return sendFail('something went wrong');
    }
}

function sendFail(message: string): APIGatewayProxyResult {    
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    }
}
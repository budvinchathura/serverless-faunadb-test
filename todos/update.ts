import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import { buildResponse } from './util';


export const update = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  const data = JSON.parse(event.body);
  if (!event.pathParameters.id || !!data.text) {
    console.error('Validation Failed');
    const response = { status: 'ERROR', message: 'validation failed' }
    buildResponse(response, 400)
  }
  const response = { status: 'SUCCESS', data: { id: event.pathParameters.id, text: data.text } }
  return buildResponse(response, 200);


};
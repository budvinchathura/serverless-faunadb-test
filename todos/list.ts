import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';
import { buildResponse } from './util';


export const list = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {

  const response = { status: 'SUCCESS', data: [{ id: 1, text: 'one' }, { id: 2, text: 'two' }] }
  return buildResponse(response, 200);

};

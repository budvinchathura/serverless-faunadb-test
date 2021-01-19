import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import faunadb = require('faunadb');
import { buildResponse } from './util';
const q = faunadb.query;


export const get = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  const id: string = event.pathParameters.id;
  const response = { status: 'SUCCESS', data: { id, text: 'dummy text' } }
  return buildResponse(response, 200);


};
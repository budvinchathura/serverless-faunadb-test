import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import * as faunadb from 'faunadb'
import { FaunaDBObject } from './types';
import { buildResponse, formatObject, handleException } from './util';
const q = faunadb.query;
const { Ref, Collection, Get } = q;


export const get = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const id: string = event.pathParameters.id;
    if (!id) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });
    const user: FaunaDBObject = await faunadbClient.query(
      Get(Ref(Collection('users'), id))
    )
    const response = { status: 'SUCCESS', data: { user: formatObject(user) } }
    return buildResponse(response, 200);
    
  } catch (error) {
    return handleException(error);
  }



};
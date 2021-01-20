import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';
import * as faunadb from 'faunadb';
import { FaunaDBObject } from './types';
import { buildResponse, formatObject, handleException } from './util';
const q = faunadb.query;
const { Ref, Collection, Update } = q;

export const update = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const id: string = event.pathParameters.id;

    if (!id) {
      console.error('Validation Failed');
      const response = { status: 'ERROR', message: 'validation failed' }
      buildResponse(response, 400)
    }
    const data = JSON.parse(event.body);
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const updatedUser: FaunaDBObject = await faunadbClient.query(
      Update(
        Ref(Collection('users'), id),
        { data: { ...data } },
      )
    )
    const response = { status: 'SUCCESS', data: { user: formatObject(updatedUser) } }
    return buildResponse(response, 200);
  } catch (error) {
    return handleException(error);
  }



};
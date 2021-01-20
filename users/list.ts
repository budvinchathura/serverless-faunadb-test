import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';
import * as faunadb from 'faunadb';
import { FaunaDBListResult } from './types';
import { buildResponse, formatObject, handleException } from './util';

const q = faunadb.query;
const { Map, Paginate, Documents, Collection, Lambda, Get } = q;


export const list = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const users: FaunaDBListResult = await faunadbClient.query(
      Map(
        Paginate(Documents(Collection('users')), { size: 100 }),
        Lambda(x => Get(x))
      )
    )

    const processed: Array<unknown> = users.data.map(user => formatObject(user))

    const response = { status: 'SUCCESS', data: { users: processed } }
    return buildResponse(response, 200);

  } catch (error) {
    return handleException(error);
  }


};

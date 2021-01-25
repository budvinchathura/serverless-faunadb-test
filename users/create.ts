import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import * as faunadb from 'faunadb'
import { buildResponse, formatObject, handleException } from './util'
import { FaunaDBObject } from './types';

const q = faunadb.query;
const { Create, Collection } = q;

export const create = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const data = JSON.parse(event.body)
    if (!data.name || !data.dob || !data.city || !data.email) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const user: FaunaDBObject = await faunadbClient.query(
      Create(
        Collection('users'),
        {
          data: {
            name: data.name,
            dob: data.dob,
            city: data.city,
            email: data.email
          }
        }
      )
    )

    const response = { status: 'SUCCESS', data: { user: formatObject(user) } }
    return buildResponse(response, 200);
  } catch (error) {
    return handleException(error);
  }

}

import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import * as faunadb from 'faunadb'
import { buildResponse, formatObject, handleException } from './util'
import { FaunaDBObject } from './types';

const q = faunadb.query;
const { Create, Collection, Ref } = q;

export const follow = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const data = JSON.parse(event.body)
    if (!data.from || !data.to) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const followRecord: FaunaDBObject = await faunadbClient.query(
      Create(
        Collection('follows'),
        {
          data: {
            from: Ref(Collection('users'), data.from),
            to: Ref(Collection('users'), data.to),
            followedOn: (new Date()).toISOString(),
          }
        }
      )
    )

    const response = { status: 'SUCCESS', data: { followRecord: formatObject(followRecord) } }
    return buildResponse(response, 200);
  } catch (error) {
    return handleException(error);
  }

}

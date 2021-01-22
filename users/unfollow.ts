import * as uuid from 'uuid'

import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import * as faunadb from 'faunadb'
import { buildResponse, formatObject, handleException } from './util'
import { FaunaDBObject } from './types';

const q = faunadb.query;
const { Collection, Delete, Get, Index, Match, Ref, Select } = q;

export const unfollow = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const data = JSON.parse(event.body)
    if (!data.from || !data.to) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const followRecord: FaunaDBObject = await faunadbClient.query(
      Delete(Select('ref', Get(
        Match(Index('follows_index'), Ref(Collection('users'), data.from), Ref(Collection('users'), data.to))
      )))
    )

    const response = { status: 'SUCCESS', data: { followRecord: formatObject(followRecord) } }
    return buildResponse(response, 200);
  } catch (error) {
    return handleException(error);
  }

}

import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';
import * as faunadb from 'faunadb';
import { join } from 'path';
import { FaunaDBListResult } from './types';
import { buildResponse, formatObject, handleException } from './util';

const q = faunadb.query;
const { Index, Map, Match, Paginate, Lambda, Get, Var, Ref, Collection, } = q;


export const followers = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const id: string = event.pathParameters.id;
    if (!id) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const followers: FaunaDBListResult = await faunadbClient.query(
      Map(
        Paginate(Match(
          Index("follows_to_index"),
          Ref(Collection("users"), id)
        )),
        Lambda('ref', Get(Var('ref')))
      )
    )

    const processed: Array<unknown> = followers.data.map(user => formatObject(user))

    const response = { status: 'SUCCESS', data: { followers: processed } }
    return buildResponse(response, 200);

  } catch (error) {
    return handleException(error);
  }

};

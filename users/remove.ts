import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import * as faunadb from 'faunadb'
import { FaunaDBObject } from './types';
import { buildResponse, formatObject, handleException } from './util';
const q = faunadb.query;
const { Ref, Collection, Delete, Lambda, Let, Match, Index, Paginate, Var, Map } = q;


export const remove = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  try {
    const id: string = event.pathParameters.id;
    if (!id) {
      console.error('Validation Failed')
      const response = { status: 'ERROR', message: 'validation failed' }
      return buildResponse(response, 400)
    }
    const faunadbClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY, keepAlive: false });

    const deleteData: FaunaDBObject = await faunadbClient.query(
      Let(
        {
          userId: id,
          userRef: Ref(Collection("users"), Var('userId')),
          followerRecordsRef: Paginate(
            Match(Index("follow_record_by_follower_index"), Var("userRef"))
          ),
          deleteFollowerRecords: Map(
            Var("followerRecordsRef"),
            Lambda("ref", Delete(Var("ref")))
          ),
          followeeRecordsRef: Paginate(
            Match(Index("follow_record_by_followee_index"), Var("userRef"))
          ),
          deleteFolloweeRecords: Map(
            Var("followeeRecordsRef"),
            Lambda("ref", Delete(Var("ref")))
          ),
          deleteUser: Delete(Var("userRef"))
        },
        true
      )

    )
    const response = { status: 'SUCCESS' }
    return buildResponse(response, 200);

  } catch (error) {
    return handleException(error);
  }



};
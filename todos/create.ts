import * as uuid from 'uuid'

import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import { buildResponse } from './util'

export const create = async (event: APIGatewayEvent, context: Context, callback): Promise<ProxyResult> => {
  const data = JSON.parse(event.body)
  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    const response = { status: 'ERROR', message: 'validation failed' }
    return buildResponse(response, 400)
  }
  const response = { status: 'SUCCESS', data: { id: uuid.v1(), text: data.text } }
  return buildResponse(response, 200);
}

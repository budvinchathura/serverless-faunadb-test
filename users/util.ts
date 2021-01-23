import { ProxyResult } from 'aws-lambda'
import { FaunaDBObject } from './types'

export const buildResponse = (body: any, statusCode: number): ProxyResult => {
  const response: ProxyResult = {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode
  }
  return response
}

export const handleException = (error: any): ProxyResult => {
  console.error(error);

  return buildResponse({ status: 'ERROR', message: error }, error?.requestResult?.statusCode ?? 500);
}

export const formatObject = (faunaObject: FaunaDBObject): unknown => {
  return {
    ...faunaObject.data,
    id: faunaObject.ref.id
  }
}

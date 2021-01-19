import { ProxyResult } from 'aws-lambda'

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

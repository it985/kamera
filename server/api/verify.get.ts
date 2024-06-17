import jwt from 'jsonwebtoken'
import { fetchAuth } from '~/utils/query'

export default defineEventHandler(async (req) => {
  const token = req?.headers?.get('authorization')?.replace('Bearer ', '')
  const { secretKey } = await fetchAuth()
  try {
    const { err } = jwt.verify(token, secretKey)
  } catch (e) {
    return Response.json({ code: 401, message: 'Unauthorized', data: null })
  }
  return Response.json({ code: 200, message: '放行', data: null })
})

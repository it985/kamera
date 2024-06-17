import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import { fetchAuth } from '~/utils/query'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { password, secretKey, username } = await fetchAuth()

  const hashedPassword = CryptoJS.HmacSHA512(body.password, secretKey).toString()

  if (password && username === body.username && hashedPassword === password) {
    const payload = { username }
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' })
    return Response.json({ code: 200, message: '登录成功！', data: {
        token,
        tokenName: 'Bearer',
      } })
  }
  return Response.json({ code: 500, message: '用户名或密码错误！', data: null })
})

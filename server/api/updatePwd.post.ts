import CryptoJS from 'crypto-js'
import sql from '~/config/db'
import { fetchAuth } from '~/utils/query'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const oldPassword = body.oldPassword || ''
  const newPassword = body.newPassword || ''

  const { password, secretKey } = await fetchAuth()

  const hashedPassword = CryptoJS.HmacSHA512(oldPassword, secretKey).toString()
  if (hashedPassword !== '' && password !== '' && password === hashedPassword) {
    const newHashedPassword = CryptoJS.HmacSHA512(newPassword, secretKey).toString()
    const data = await sql`
        UPDATE public.kamera_config
        SET config_value = ${newHashedPassword}
        WHERE config_key = 'password';
    `
    if (!data.length) {
      return Response.json({ code: 200, message: '更新成功！', data: null })
    }
    return Response.json({ code: 500, message: '密码修改失败！', data: null })
  }
  return Response.json({ code: 500, message: '旧密码不正确！', data: null })
})

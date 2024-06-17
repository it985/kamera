import sql from '~/config/db'

export default defineEventHandler(async (event) => {
  const data = await sql`
      SELECT 
          * 
      FROM 
          public.kamera_image
      WHERE
          del = 0
      ORDER BY sort DESC, create_time DESC, update_time DESC
  `

  if (!data) {
    return Response.json({ code: 500, message: '没有数据！', data: null})
  }

  return Response.json({ code: 200, message: 'success', data: data})
})

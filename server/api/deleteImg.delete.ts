import sql from '~/config/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const data = await sql`
        UPDATE public.kamera_image
        SET del = 1
        WHERE id = ${body.id}
    `

  if (!data.length) {
    return Response.json({ code: 200, message: '删除成功！', data: null })
  }
  return Response.json({ code: 500, message: '删除失败！', data: null })
})

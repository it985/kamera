import sql from '~/config/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = body.id || 0
  const show = body.show || 0

  if (id && id > 0) {
    const data = await sql`
            UPDATE public.kamera_image
            SET show = ${show}
            WHERE id = ${id}
        `
    if (!data.length) {
      return Response.json({ code: 200, message: '更新成功！', data: null })
    }
  }
  return Response.json({ code: 500, message: '更新失败！', data: null })
})

import sql from '~/config/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = body.id || 0
  const type = body.type || ''
  const url = body.url || ''
  const detail = body.detail || ''
  const rating = body.rating || 0
  let sort = body.sort || 0

  if (sort < 0 || sort > 32767) {
    sort = 0
  }

  if (id && id > 0) {
    const data = await sql`
            UPDATE public.kamera_image
            SET type = ${type}, url = ${url}, detail = ${detail}, rating = ${rating}, sort = ${sort}
            WHERE id = ${id}
        `
    if (!data.length) {
      return Response.json({ code: 200, message: '更新成功！', data: null })
    }
  }
  return Response.json({ code: 500, message: '更新失败！', data: null })
})

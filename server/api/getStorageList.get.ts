import { fetchStorageInfo } from '~/utils/query'

export default defineEventHandler(async (event) => {
  const { alistToken, alistUrl } = await fetchStorageInfo()
  const res: any = await $fetch(`${alistUrl}/api/admin/storage/list`, {
    timeout: 60000,
    method: 'get',
    headers: {
      Authorization: alistToken,
    },
  })
  if (res?.code === 200) {
    return Response.json({ code: 200, message: '获取成功！', data: res?.data.content })
  }
  return Response.json({ code: 500, message: '获取失败！', data: null })
})

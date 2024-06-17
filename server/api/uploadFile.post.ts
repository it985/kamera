import s3 from '~/config/s3'
import { fetchStorageInfo } from '~/utils/query'

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)

  const file = body[0].data
  const storage = body[1].data
  const type = body[2].data
  const mountPath = body[3].data

  const { alistToken, alistUrl, bucket, cdnUrl, endpoint, storageFolder } = await fetchStorageInfo()

  if (storage && storage.toString() === 's3') {
    const uploadParams = { Bucket: bucket, Key: '', Body: '' }
    const fileName = storageFolder && storageFolder !== '/'
      ? `${storageFolder}/${type}/${body[0].filename}`
      : `${type}/${body[0].filename}`
    uploadParams.Body = file
    uploadParams.Key = fileName

    await s3.upload(uploadParams, (err: any, data: any) => {
      if (err) {
        throw createError({ statusCode: 500, statusMessage: 'Upload Error!' })
      }
    })
    return Response.json({ code: 200, message: '文件上传成功！', data: {
        url: cdnUrl && cdnUrl !== ''
          ? `https://${cdnUrl}/${fileName}`
          : `https://${bucket}.${endpoint}/${fileName}`,
      } })
  } else {
    const filePath = encodeURIComponent(`${mountPath.toString() === '/' ? '' : mountPath}/${type}/${body[0].filename}`)
    const data: any = await $fetch(`${alistUrl}/api/fs/put`, {
      timeout: 60000,
      method: 'put',
      headers: {
        'Authorization': alistToken,
        'File-Path': filePath,
      },
      body: file,
    })
    if (data?.code === 200) {
      const res: any = await $fetch(`${alistUrl}/api/fs/get`, {
        timeout: 60000,
        method: 'POST',
        headers: {
          'Authorization': alistToken,
          'File-Path': filePath,
        },
        body: JSON.stringify({ path: decodeURIComponent(filePath) })
      })
      if (res?.code === 200) {
        return Response.json({ code: 200, message: '文件上传成功！', data: {
          url: res?.data.raw_url
          } })
      } else {
        return Response.json({ code: 500, message: '文件路径获取失败！', data: null })
      }
    }
  }
  return Response.json({ code: 500, message: '文件路径获取失败！', data: null })
})

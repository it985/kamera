import { fetchStorageInfo } from '~/utils/query'

export default defineEventHandler(async (event) => {
  const { accesskeyId, accesskeySecret, region, endpoint, bucket, storageFolder, cdnUrl, alistUrl, alistToken } = await fetchStorageInfo()

  return Response.json({ code: 200, message: 'success', data: {
      accesskeyId,
      accesskeySecret,
      region,
      endpoint,
      bucket,
      storageFolder,
      cdnUrl,
      alistUrl,
      alistToken,
    }
  })
})

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const user = useUserStore()
    const { noLoginPageWhiteList, loginPageWhiteList } = useAppConfig()

    if (noLoginPageWhiteList.includes(to.path))
      return
    if (loginPageWhiteList.includes(to.path) && !user.token) {
      return navigateTo('/login')
    }

    const res = await $fetch('/api/verify', {
      method: 'get',
      headers: {
        Authorization: `${user.tokenName} ${user.token}`,
      },
    })
    if (res?.code === 401) {
      return navigateTo('/login')
    }
    if (res?.code === 200) {
      return
    }
    return
  }
})

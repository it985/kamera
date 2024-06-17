<script setup lang="ts">
const toast = useToast()
const user = useUserStore()
const indexDataList = ref<Array<Object>>([])
const indexLoading = ref<boolean>(false)
const mounted = ref<boolean>(false)
const imgId = ref<number>(0)
const showModal = ref<boolean>(false)
const handleButton = ref<boolean>(true)
const pageInfo = reactive({
  total: 0,
  totalPage: 0,
  pageNum: 1,
  pageSize: 10,
})

const indexDataHandle = async () => {
  indexLoading.value = true
  try {
    const res = await $fetch('/api/getImageList', {
      method: 'post',
      headers: {
        Authorization: `${user.tokenName} ${user.token}`,
      },
      body: { pageNum: pageInfo.pageNum, pageSize: pageInfo.pageSize, type: 'index' },
    })
    if (res?.code === 200) {
      if (pageInfo.pageNum <= res?.data.totalPage) {
        if (pageInfo.pageNum === res?.data.totalPage) {
          handleButton.value = false
        }
        pageInfo.pageNum++
        if (indexDataList.value.length === 0) {
          indexDataList.value = res?.data.data
        } else {
          indexDataList.value = indexDataList.value.concat(res?.data.data)
        }
        pageInfo.total = res?.data.total
        pageInfo.totalPage = res?.data.totalPage
      }
    }
  } catch (e) {
    toast.add({ title: '加载失败！', timeout: 2000, color: 'red' })
  } finally {
    indexLoading.value = false
  }
}

const modalUpdate = () => {
  showModal.value = false
}

const clickImg = (id: number) => {
  imgId.value = id
  showModal.value = true
}

onUnmounted(() => {
  imgId.value = 0
  indexDataList.value = []
  pageInfo.total = 0
  pageInfo.totalPage = 0
  pageInfo.pageNum = 1
})

onBeforeMount(async () => {
  await indexDataHandle()
})

onMounted(() => {
  mounted.value = true
})

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div p2>
    <div flex flex-col justify-center items-center mt4>
      <div
        v-if="indexDataList?.length > 0"
        flex flex-col justify-center items-center space-y-8 w-full
      >
        <div
          class="w-11/12 md:w-3/4"
          v-for="item in indexDataList"
          :key="item.id"
          shadow-xl border-4 bg-white cursor-pointer aspect-video
          @click="clickImg(item.id)"
        >
          <el-image
            :src="item.url"
            :alt="item.detail"
            lazy
            style="display: block !important;"
          >
          </el-image>
        </div>
      </div>
      <div v-else-if="indexLoading">
        加载中...
      </div>
      <el-empty v-else-if="!mounted" description=" " />
      <el-empty v-else description="暂时没有精选图片，请登录后进入后台管理！" />
    </div>

    <Canvas :showModal="showModal" :dataList="indexDataList" :imgId="imgId" @modalUpdate="modalUpdate" />
    <div v-if="handleButton && indexDataList?.length !== 0" flex justify-center items-center w-full h-24>
      <el-button :loading="indexLoading" @click="indexDataHandle">加载更多</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>

<h1 align="center">
<img width="28" src="./public/maskable-icon.png">
Kamera
</h1>

<p align="center">
  <a href="https://github.com/besscroft/kamera/blob/main/LICENSE"><img src="https://img.shields.io/github/license/besscroft/kamera?style=flat-square" alt="许可证"></a>
  <img src="https://img.shields.io/github/repo-size/besscroft/kamera?style=flat-square&color=328657" alt="存储库大小">
</p>

一款专供摄影佬使用的记录网站，基于 Nuxt 3 开发，瀑布流展示图片，预览图片及 EXIF 信息，支持常见的图片格式。
可读取 EXIF 信息并上传、管理维护图片数据，首页精品照片展示，子页分类展示等功能。
图片存储兼容 S3 API、AList API、支持 CDN 配置。同时适配了 PC 和移动端的样式与交互。
今天又是想当二次元摄影高手的一天呢！

> 试试 kamera 的下一个版本 [PicImpact](https://github.com/besscroft/PicImpact)

### 无障碍支持

已经在尽力支持了，主要基于 [WAI-ARIA 规范](https://developer.mozilla.org/zh-CN/docs/Learn/Accessibility/WAI-ARIA_basics)，有爱，无障碍！

### 如何部署

你可以 Fork 后点击下面的按钮来一键部署到 Vercel（自定义配置及容器部署请往下看）

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbesscroft%2Fkamera&env=Postgre_HOST,Postgre_PORT,Postgre_DATABASE,Postgre_USERNAME,Postgre_PASSWORD"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

当然，如果你想部署到其它平台或者自部署也是可以的，只需要改一下预设即可 `nuxt.config.ts`：

```ts
nitro: {
  preset: 'vercel' // 可选 vercel、netlify、node-server，或者删除这一行，构建时也会自适应的。
}
```

#### 数据库

数据库请选择兼容 PostgreSQL 的数据库，我推荐 [SupaBase](https://supabase.com/)，它的每月免费额度足够个人使用了！
创建数据库后，将 `doc/sql/schema.sql` 导入到数据库执行。在 `Dashboard` 的 `Settings` 找到 `Database` 部分，你就能查看连接信息了。
当然，只要是兼容 pg 的数据库都是可以选择的，不必局限于某个平台。

> 注：从 2024-01-26 起，将[删除通过 IPv4 和 pgBouncer 的数据库访问方式](https://github.com/orgs/supabase/discussions/17817)。
> 在这之前部署且数据库使用 SupaBase 的用户，请更新数据库连接信息。
> 在 `Connection parameters` 里勾选 `Use connection pooling` 选项即可。

> 请确保您的数据库用户配置了正确的 Row Level Security（行级别安全性）权限，否则将无法正常访问。
>
> 如果您是第一次部署，仅需要执行 `schema.sql` 即可，如果您是升级到涉及数据库变更的版本，请在执行对应版本编号的 sql 后再升级部署！
> 
> 系统默认账号密码为：admin / 666666

#### 图片存储

存储你可以选择 AWS S3、阿里云 OSS 或者自建 MinIO（理论上来说兼容 S3 的都行），也可以交由你正在用的 AList 来维护。

#### 环境变量

请在部署前设置您的环境变量，程序会去读这些值，用以更改构建步骤或函数执行期间的行为。

所有值都经过静态加密，并且对有权访问该项目的任何用户都可见。使用非敏感数据和敏感数据都是安全的。**但请注意您自己不要泄露环境变量的值！**

如果您更改了环境变量，它不会影响当前的部署，您需要重新构建部署后才会生效！

当然，如果您是容器化部署的，更改环境变量后只需要重启容器就行了，无需重新构建！

受限于 Nuxt3 的局限性，某些设计可能不是特别人性化（主要还是懒），望理解！

> 请注意，平台部署请在平台控制台填写环境变量，会自动覆盖 `.env.production` 的值，以免发生机密信息泄露！
> 
> 项目内默认的 key 都是用作演示用途！

| Key              | 备注                                    |
|------------------|---------------------------------------|
| Postgre_HOST     | Postgre 数据库主机，如：db.kamera.supabase.co |
| Postgre_PORT     | Postgre 数据库端口，默认值：5432                |
| Postgre_DATABASE | Postgre 数据库名称，默认值：postgres            |
| Postgre_USERNAME | Postgre 数据库用户名，默认值：postgres           |
| Postgre_PASSWORD | Postgre 数据库密码，默认值：postgres            |

#### 页面配置

我们支持自定义相册页面的标题和链接，当然也是支持多个相册页面的。
你需要在 `constants\photos.json` 文件中，进行如下配置：

```json
[
  {
    "title": "Cosplay",
    "url": "/cosplay",
    "icon": "i-carbon-camera"
  },
  {
    "title": "集邮",
    "url": "/tietie",
    "icon": "i-carbon-face-wink"
  },
  {
    "title": "时光相册",
    "url": "/timeline",
    "icon": "i-carbon-image"
  }
]
```

顾名思义，`title` 和 `url` 对应的就是页面标题和页面地址，如果您想正常使用的话，还请照葫芦画瓢，而不是乱填。
图标可以在 [Icones](https://icones.js.org/collection/carbon) 找到，用相同的规则填写在 `icon` 中.

> 每配置一个页面，都会对应的增添一个图片类别选项，在您的对象存储中，也会增加对应的文件夹。
> 
> 同时也会被配置成 `pre-rendered`，从而在某些情况下加快 `Hydration`，带来更快的页面加载，以及更好的 SEO。 
> 
> 注意添加的页面，别忘了配置白名单哦！

#### 白名单配置

我们提供了客户端路由中间件和服务端接口中间件，默认情况下你不需要管，但如果你想自定义白名单，这里提供了配置方案。
在 `app.config.ts` 文件中，可以看到如下默认配置：

```ts
export default defineAppConfig({
    noLoginPageWhiteList: [
        '/',
        '/login',
        '/tietie',
        '/cosplay',
        '/timeline',
        '/about',
        '/error',
    ],
    loginPageWhiteList: [
        '/admin',
        '/admin/upload',
        '/admin/list',
        '/admin/system',
    ],
    apiWhiteList: [
        '/api/login',
        '/api/verify',
        '/api/getImageList',
    ]
})
```

> `noLoginPageWhiteList` 对于客户端路由中间件和服务端接口中间件来说，不需要登录就能访问的页面。
> 
> `loginPageWhiteList` 对于客户端路由中间件来说，需要 token 才能访问；对于服务端接口中间件来说，必须要填写才能访问的页面。
> 
> `apiWhiteList` 不需要 token 就能访问的接口。

#### 网站配置

在 `constants/index.ts` 文件，可以配置：

| Key              | 备注                          |
| ---------------- |-----------------------------|
| appName     | 网站标题                        |
| appDescription     | 网站描述                        |

在 `app.config.ts` 文件中，可以配置：

| Key              | 备注                          |
| ---------------- |-----------------------------|
| mobileRow     | 移动端瀑布流显示列数，可选值[1, 2] |

### 容器部署

我把容器部署往后放，是不希望前面的内容被跳过，这样你在构建/部署时才能得心应手！

#### 直接部署

如果你想用我的镜像（由 GitHub Actions 构建），就意味着你的某些配置与我相同，比如网站的几个目录。
但实际上你肯定得改一下网站标题，配置子页面啊之类的，改一下音乐播放器里面的歌之类的。

所以我的镜像只适合你快速体验预览之类的，还是建议你自己构建（反正也很方便），或者你直接部署到 Vercel 之类的平台。
如果你要运行我的镜像，你只需要执行下面的命令即可部署：

```shell
docker run -d --name kamera \
  -p 3000:3000 \
  -e Postgre_HOST="db.supabase.co" \
  -e Postgre_PORT="5432" \
  -e Postgre_DATABASE="postgres" \
  -e Postgre_USERNAME="postgres" \
  -e Postgre_PASSWORD="postgres" \
  besscroft/kamera:latest
```

> 看到这里您应该明白，环境变量当然要换成自己的！

#### 自己构建镜像

无需多说，直接 fork 本项目，然后更改任意文件并 `commit` 后，会自动触发 GitHub Actions 构建。
当然在那之前，你需要先在你 fork 的仓库创建 2 个机密，具体看[为存储库创建机密](https://docs.github.com/zh/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)

> `DOCKERHUB_USERNAME` 和 `DOCKERHUB_TOKEN` 这两个，这样才能在构建后，上传到你自己的 docker 仓库去。

在构建好镜像之后，你可以用上面的命令执行（记得镜像换成你自己构建的哈），如果你要 Docker Compose 执行：

```yaml
version: '3'
services:
  kamera:
    image: besscroft/kamera:latest
    container_name: kamera
    ports:
      - 3000:3000
    environment:
      - Postgre_HOST="db.supabase.co"
      - Postgre_PORT=5432
      - Postgre_DATABASE="postgres"
      - Postgre_USERNAME="postgres"
      - Postgre_PASSWORD="postgres"
```

> 一样的，参考上面的环境变量表格，配置你自己的环境变量。

#### 构建镜像 Q&A

Q：我 fork 仓库后，网站设置也改了自己的之后，构建的镜像被人使用会有风险吗？

A：原则上没有，但如果你自己要往文件里面填写机密信息，那是你自己的问题！
别人并不知道你的环境变量的值，除非你自己泄露！

Q：用你这玩意怎么这么麻烦？人家的都能放数据库里面，访问时动态获取。

A：基于 SSR 的特性大部分配置内容，是在编译期处理的，比如咱们配置的那些自定义页面。原则上来说，能放进数据库的配置，我已经尽量塞进去了！

#### 自行编译并部署

这种方式适合那些想自己打包直接放在 Node 上跑的朋友。

```shell
git clone https://github.com/besscroft/kamera.git

pnpm i

pnpm run build
```

构建完成后，你会看到一个 `.output` 文件夹，你可以使用如下命令运行：

```shell
node /app/.output/server/index.mjs
```

> 如果你选择这种部署方式，我相信你是会使用 Node 的。

#### 服务器面板

对于使用宝塔面板、1Panel 之类的用户，包括使用 Nginx 来提供访问服务的用户，记得配置反向代理：

```shell
location ^~ / {
  proxy_pass http://localhost:3000;
}
```

> 端口和路径之类的，就看你自己部署时，设置的什么了。

### 本地开发

克隆到本地开发:

```shell
git clone https://github.com/besscroft/kamera.git

pnpm i

pnpm run dev
```

如果您有任何建议，欢迎反馈！

### 代码贡献

[提出新想法 & 提交 Bug](https://github.com/besscroft/kamera/issues/new) | [Fork & Pull Request](https://github.com/besscroft/kamera/fork)

Kamera 欢迎各种贡献，包括但不限于改进，新功能，文档和代码改进，问题和错误报告。`dev` 分支接受 `PR`！

> 有需求和建议都可以提，有空的话我会处理，但受限于 Nuxt3 / SSR 的⌈局限性⌋，很多功能的设计上可能会有取舍。

### 隐私安全

您使用本程序时，需要自己去维护各个平台的配置信息（毕竟跟咱没关系，需要在对应的平台配置），以及对象存储的读写权限、访问控制、防盗链、跨域设置、缓存策略和 CDN 等配置，以最大程度的避免天价账单。

如您有更多疑问，可以提交 [Issue](https://github.com/besscroft/kamera/issues/new)。

### 浏览器支持

- Last 2 versions of Chrome, Firefox, Safari and Edge
- Firefox ESR

> 事实上不是过于老旧的浏览器，一般都是能用的。

### 技术栈

- Web框架：
  - [Vue 3](https://github.com/vuejs/core)
  - [Nuxt 3](https://github.com/nuxt/nuxt)
- UI 框架：
  - [Element Plus](https://github.com/element-plus/element-plus)
  - [Nuxt UI](https://github.com/nuxt/ui)
- 更多组件参见 package.json

### 感谢

本项目使用 JetBrains 的开源许可证，基于 IntelliJ IDEA 开发，感谢！

![JetBrains 徽标（主要） logo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)

![IntelliJ IDEA logo](https://resources.jetbrains.com/storage/products/company/brand/logos/IntelliJ_IDEA.svg)

### License

Kamera is open source software licensed as [MIT](https://github.com/besscroft/kamera/blob/main/LICENSE).


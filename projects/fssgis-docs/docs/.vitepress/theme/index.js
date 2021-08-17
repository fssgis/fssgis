import DefaultTheme from 'vitepress/theme'
import { FssgIcon, FssgIconFont } from '@fssgis/ui'

const modules = import.meta.glob('../../components/**/*.vue')

export default {
  ...DefaultTheme,
  async enhanceApp({ app, router }) {
    await Promise.all(Object.entries(modules).map(async ([path, fn]) => {
      const _ = await fn()
      app.component(path.split('.vue')[0].split('/')[path.split('.vue')[0].split('/').length - 1], _.default)
    }))

    app.component('FssgIcon', FssgIcon)
    app.component('FssgIconFont', FssgIconFont)
    
    const sourcePath = router.route.path
    router.go('/')
    setTimeout(() => {
      router.go(sourcePath)
    }, 100)
  }
}
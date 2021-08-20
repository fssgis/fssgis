module.exports = {
  title: 'fssgis',
  description: 'fssgis',

  themeConfig: {
    repo: 'fssgis/fssgis',
    docsDir: 'docs',

    algolia: {
      apiKey: 'c57105e511faa5558547599f120ceeba',
      indexName: 'vitepress'
    },

    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
    ],

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
        { text: '图标组件 @fssgis/icon', link: '/guide/fssgis-icon' },
        { text: 'Grid布局组件 @fssgis/grid', link: '/guide/fssgis-grid' },
        { text: '工具库 @fssgis/utils', link: '/guide/fssgis-utils' },
        { text: 'svg转字体文件', link: '/guide/svg2icon' },
      ]
    },
    {
      text: '地图库',
      children: [
        { text: '基础地图库', link: '/guide/map/fssg-map' },
        { text: 'Leaflet地图库', link: '/guide/map/fssg-leaflet' },
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'Frontmatter', link: '/guide/frontmatter' },
      ]
    },
    {
      text: '@fssgis/fssg-esri地图库',
      children: [
        { text: '介绍及基础使用', link: '/guide/esri/base' },
        { text: 'Basemap底图控制插件', link: '/guide/esri/basemap' },
        { text: 'MapElement图元控制插件', link: '/guide/esri/map-element' },
      ]
    },
    {
      text: '@fssgis/fssg-esri-hooks钩子库',
      children: [
        { text: 'FssgEsri响应式钩子', link: '/guide/esri-hooks/fssg-esri-hooks' },
        { text: 'Basemap响应式钩子', link: '/guide/esri-hooks/basemap-hooks' },
      ]
    }
  ]
}

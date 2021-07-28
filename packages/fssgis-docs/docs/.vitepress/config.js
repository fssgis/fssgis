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
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'Frontmatter', link: '/guide/frontmatter' },
      ]
    }
  ]
}

module.exports = {
  title: 'FSSGIS',
  description: 'Code and Build FSSG',
  base: '/fssgis-docs/',
  themeConfig: {
    repo: 'fssgis/fssgis',
    docsDir: 'docs',

    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      { text: 'Sdk', link: '/sdk' },
      { text: 'Else', link: '/else' },
    ],
    sidebar: {
      '/else': [
        {
          text: 'Introduction',
          children: [
            { text: 'ELSE HOME', link: '/else' },
          ],
        },
        {
          text: '便捷工具',
          children: [
            { text: 'Guid Generator', link: '/else/guid-generator' },
            { text: 'PNG to Base64', link: '/else/png-to-base64' },
            { text: 'EPSG IO', link: '/else/epsg-io' },
            { text: 'Chrome Plugins', link: '/else/chrome-plugins' },
          ],
        },
      ],
      '/sdk': [
        { text: 'SDK HOME', link: '/sdk' },
        { text: '@fssgis/utils', link: '/sdk/fssgis-utils' },
      ],
      '/': [
        {
          text: 'Introduction',
          children: [
            { text: 'What is FSSGIS?', link: '/' },
          ],
        },
        {
          text: '@fssgis/utils',
          children: [
            { text: 'use to @fssgis/utils', link: '/guide/fssgis-utils/index' },
            { text: 'deepCopyJSON', link: '/guide/fssgis-utils/deep-copy-json' },
          ],
        },
        {
          text: '@fssgis/ext',
          children: [
            { text: 'use to @fssgis/ext', link: '/guide/fssgis-ext/index' },
            { text: 'extNumber', link: '/guide/fssgis-ext/ext-number' },
          ],
        },
        {
          text: '@fssgis/fssg-esri',
          children: [
            { text: 'use to @fssgis/fssg-esri', link: '/guide/fssgis-esri/index' },
          ],
        },
        {
          text: '@fssgis/ui',
          children: [
            { text: 'use to @fssgis/ui', link: '/guide/fssgis-ui/index' },
            { text: 'FssgIcon 图标组件', link: '/guide/fssgis-ui/fssg-icon' },
            { text: 'FssgGrid Grid布局组件', link: '/guide/fssgis-ui/fssg-grid' },
            { text: 'FssgBox 指标可视化组件', link: '/guide/fssgis-ui/fssg-box' },
          ]
        },
        {
          text: '@fssgis/picture-viewer',
          children: [
            { text: 'use to @fssgis/picture-viewer', link: '/guide/fssgis-picture-viewer/index' },
          ],
        },
      ],
    },
  },
}

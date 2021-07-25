import{o as e,c as a,a as s}from"./app.66a6a8a9.js";const n='{"title":"Asset Handling","description":"","frontmatter":{},"headers":[{"level":2,"title":"Public Files","slug":"public-files"},{"level":2,"title":"Base URL","slug":"base-url"}],"relativePath":"guide/assets.md","lastUpdated":1627207165120}',t={},o=s('<h1 id="asset-handling"><a class="header-anchor" href="#asset-handling" aria-hidden="true">#</a> Asset Handling</h1><p>All Markdown files are compiled into Vue components and processed by <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">Vite</a>. You can, <strong>and should</strong>, reference any assets using relative URLs:</p><div class="language-md"><pre><code><span class="token url"><span class="token operator">!</span>[<span class="token content">An image</span>](<span class="token url">./image.png</span>)</span>\n</code></pre></div><p>You can reference static assets in your markdown files, your <code>*.vue</code> components in the theme, styles and plain <code>.css</code> files either using absolute public paths (based on project root) or relative paths (based on your file system). The latter is similar to the behavior you are used to if you have used <code>vue-cli</code> or webpack&#39;s <code>file-loader</code>.</p><p>Common image, media, and font filetypes are detected and included as assets automatically.</p><p>All referenced assets, including those using absolute paths, will be copied to the dist folder with a hashed file name in the production build. Never-referenced assets will not be copied. Similar to <code>vue-cli</code>, image assets smaller than 4kb will be base64 inlined.</p><p>All <strong>static</strong> path references, including absolute paths, should be based on your working directory structure.</p><h2 id="public-files"><a class="header-anchor" href="#public-files" aria-hidden="true">#</a> Public Files</h2><p>Sometimes you may need to provide static assets that are not directly referenced in any of your Markdown or theme components (for example, favicons and PWA icons). The <code>public</code> directory under project root can be used as an escape hatch to provide static assets that either are never referenced in source code (e.g. <code>robots.txt</code>), or must retain the exact same file name (without hashing).</p><p>Assets placed in <code>public</code> will be copied to the root of the dist directory as-is.</p><p>Note that you should reference files placed in <code>public</code> using root absolute path - for example, <code>public/icon.png</code> should always be referenced in source code as <code>/icon.png</code>.</p><h2 id="base-url"><a class="header-anchor" href="#base-url" aria-hidden="true">#</a> Base URL</h2><p>If your site is deployed to a non-root URL, you will need to set the <code>base</code> option in <code>.vitepress/config.js</code>. For example, if you plan to deploy your site to <code>https://foo.github.io/bar/</code>, then <code>base</code> should be set to <code>&#39;/bar/&#39;</code> (it should always start and end with a slash).</p><p>All your static asset paths are automatically processed to adjust for different <code>base</code> config values. For example, if you have an absolute reference to an asset under <code>public</code> in your markdown:</p><div class="language-md"><pre><code><span class="token url"><span class="token operator">!</span>[<span class="token content">An image</span>](<span class="token url">/image-inside-public.png</span>)</span>\n</code></pre></div><p>You do <strong>not</strong> need to update it when you change the <code>base</code> config value in this case.</p><p>However, if you are authoring a theme component that links to assets dynamically, e.g. an image whose <code>src</code> is based on a theme config value:</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">:src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>theme.logoPath<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n</code></pre></div><p>In this case it is recommended to wrap the path with the <a href="/guide/api.html#withbase"><code>withBase</code> helper</a> provided by VitePress:</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> withBase<span class="token punctuation">,</span> useData <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vitepress&#39;</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> theme <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useData</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">:src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>withBase(theme.logoPath)<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',20);t.render=function(s,n,t,p,c,i){return e(),a("div",null,[o])};export default t;export{n as __pageData};

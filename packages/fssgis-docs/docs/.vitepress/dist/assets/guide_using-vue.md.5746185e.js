import{o as n,c as s,r as a,b as t,F as e,d as o,t as p,e as c,a as i}from"./app.1c66cb00.js";const l={};l.render=function(a,t){return n(),s("span",null,"⚡")};var r={example:"_example_t4bci_2"};const u={props:["slot-key"],components:{ComponentInHeader:l},mounted(){document.querySelector(`.${this.$style.example}`).textContent="This is rendered by inline script and styled by inline CSS"}},d='{"title":"Using Vue in Markdown","description":"","frontmatter":{"sidebarDepth":3},"headers":[{"level":2,"title":"Templating","slug":"templating"},{"level":3,"title":"Interpolation","slug":"interpolation"},{"level":3,"title":"Directives","slug":"directives"},{"level":3,"title":"Access to Site & Page Data","slug":"access-to-site-page-data"},{"level":2,"title":"Escaping","slug":"escaping"},{"level":2,"title":"Using Components","slug":"using-components"},{"level":3,"title":"Importing components in markdown","slug":"importing-components-in-markdown"},{"level":3,"title":"Registering global components in the theme","slug":"registering-global-components-in-the-theme"},{"level":3,"title":"Using Components In Headers","slug":"using-components-in-headers"},{"level":2,"title":"Using CSS Pre-processors","slug":"using-css-pre-processors"},{"level":2,"title":"Script & Style Hoisting","slug":"script-style-hoisting"},{"level":2,"title":"Built-In Components","slug":"built-in-components"},{"level":2,"title":"Browser API Access Restrictions","slug":"browser-api-access-restrictions"}],"relativePath":"guide/using-vue.md","lastUpdated":1627216957790}',k=t("h1",{id:"using-vue-in-markdown"},[t("a",{class:"header-anchor",href:"#using-vue-in-markdown","aria-hidden":"true"},"#"),c(" Using Vue in Markdown")],-1),g=i('<p>In VitePress, each markdown file is compiled into HTML and then processed as a Vue Single-File Component. This means you can use any Vue features inside the markdown, including dynamic templating, using Vue components, or arbitrary in-page Vue component logic by adding a <code>&lt;script&gt;</code> tag.</p><p>It is also important to know that VitePress leverages Vue 3&#39;s compiler to automatically detect and optimize the purely static parts of the markdown. Static contents are optimized into single placeholder nodes and eliminated from the page&#39;s JavaScript payload. They are also skipped during client-side hydration. In short, you only pay for the dynamic parts on any given page.</p><h2 id="templating"><a class="header-anchor" href="#templating" aria-hidden="true">#</a> Templating</h2><h3 id="interpolation"><a class="header-anchor" href="#interpolation" aria-hidden="true">#</a> Interpolation</h3><p>Each Markdown file is first compiled into HTML and then passed on as a Vue component to the Vite process pipeline. This means you can use Vue-style interpolation in text:</p><p><strong>Input</strong></p><div class="language-md"><pre><code>{{ 1 + 1 }}\n</code></pre></div><p><strong>Output</strong></p><div class="language-text"><pre><code>2</code></pre></div><h3 id="directives"><a class="header-anchor" href="#directives" aria-hidden="true">#</a> Directives</h3><p>Directives also work:</p><p><strong>Input</strong></p><div class="language-md"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>i in 3<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{ i }} <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p><strong>Output</strong></p>',14),h={class:"language-text"},m=i('<h3 id="access-to-site-page-data"><a class="header-anchor" href="#access-to-site-page-data" aria-hidden="true">#</a> Access to Site &amp; Page Data</h3><p>You can use the [<code>useData</code> helper] in a <code>&lt;script&gt;</code> block and expose the data to the page.</p><p><strong>Input</strong></p><div class="language-md"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> useData <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vitepress&#39;</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> page <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useData</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>pre</span><span class="token punctuation">&gt;</span></span>{{ page }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>pre</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p><strong>Output</strong></p><div class="language-json"><pre><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/using-vue.html&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;title&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Using Vue in Markdown&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;frontmatter&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="escaping"><a class="header-anchor" href="#escaping" aria-hidden="true">#</a> Escaping</h2><p>By default, fenced code blocks are automatically wrapped with <code>v-pre</code>. To display raw mustaches or Vue-specific syntax inside inline code snippets or plain text, you need to wrap a paragraph with the <code>v-pre</code> custom container:</p><p><strong>Input</strong></p><div class="language-md"><pre><code>::: v-pre\n<span class="token code-snippet code keyword">`{{ This will be displayed as-is }}`</span>\n:::\n</code></pre></div><p><strong>Output</strong></p><div><p><code>{{ This will be displayed as-is }}</code></p></div><h2 id="using-components"><a class="header-anchor" href="#using-components" aria-hidden="true">#</a> Using Components</h2><p>When you need to have more flexibility, VitePress allows you to extend your authoring toolbox with your own Vue Components.</p><h3 id="importing-components-in-markdown"><a class="header-anchor" href="#importing-components-in-markdown" aria-hidden="true">#</a> Importing components in markdown</h3><p>If your components are going to be used in only a few places, the recommended way to use them is to importing the components in the file where it is used.</p><div class="language-md"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> CustomComponent <span class="token keyword">from</span> <span class="token string">&#39;../components/CustomComponent.vue&#39;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token title important"><span class="token punctuation">#</span> Docs</span>\n\nThis is a .md using a custom component\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>CustomComponent</span> <span class="token punctuation">/&gt;</span></span>\n\n<span class="token title important"><span class="token punctuation">##</span> More docs</span>\n\n...\n</code></pre></div><h3 id="registering-global-components-in-the-theme"><a class="header-anchor" href="#registering-global-components-in-the-theme" aria-hidden="true">#</a> Registering global components in the theme</h3><p>If the components are going to be used across several pages in the docs, they can be registered globally in the theme (or as part of extending the default VitePress theme). Check out the [Theming Guide] for more information.</p><p>In <code>.vitepress/theme/index.js</code>, the <code>enhanceApp</code> function receives the Vue <code>app</code> instance so you can <a href="https://v3.vuejs.org/guide/component-registration.html#component-registration" target="_blank" rel="noopener noreferrer">register components</a> as you would do in a regular Vue application.</p><div class="language-js"><pre><code><span class="token keyword">import</span> DefaultTheme <span class="token keyword">from</span> <span class="token string">&#39;vitepress/theme&#39;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  <span class="token operator">...</span>DefaultTheme<span class="token punctuation">,</span>\n  <span class="token function">enhanceApp</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> app <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;VueClickAwayExample&#39;</span><span class="token punctuation">,</span> VueClickAwayExample<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>Later in your markdown files, the component can be interleaved between the content</p><div class="language-md"><pre><code><span class="token title important"><span class="token punctuation">#</span> Vue Click Away</span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>VueClickAwayExample</span> <span class="token punctuation">/&gt;</span></span>\n</code></pre></div><div class="warning custom-block"><p class="custom-block-title">IMPORTANT</p><p>Make sure a custom component’s name either contains a hyphen or is in PascalCase. Otherwise, it will be treated as an inline element and wrapped inside a <code>&lt;p&gt;</code> tag, which will lead to hydration mismatch because <code>&lt;p&gt;</code> does not allow block elements to be placed inside it.</p></div>',24),y={id:"using-components-in-headers"},v=t("a",{class:"header-anchor",href:"#using-components-in-headers","aria-hidden":"true"},"#",-1),f=c(" Using Components In Headers "),w=i('<p>You can use Vue components in the headers, but note the difference between the following syntaxes:</p><table><thead><tr><th>Markdown</th><th>Output HTML</th><th>Parsed Header</th></tr></thead><tbody><tr><td><pre><code> # text &lt;Tag/&gt; </code></pre></td><td><code>&lt;h1&gt;text &lt;Tag/&gt;&lt;/h1&gt;</code></td><td><code>text</code></td></tr><tr><td><pre><code> # text `&lt;Tag/&gt;` </code></pre></td><td><code>&lt;h1&gt;text &lt;code&gt;&amp;lt;Tag/&amp;gt;&lt;/code&gt;&lt;/h1&gt;</code></td><td><code>text &lt;Tag/&gt;</code></td></tr></tbody></table><p>The HTML wrapped by <code>&lt;code&gt;</code> will be displayed as-is; only the HTML that is <strong>not</strong> wrapped will be parsed by Vue.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The output HTML is accomplished by <a href="https://github.com/markdown-it/markdown-it" target="_blank" rel="noopener noreferrer">markdown-it</a>, while the parsed headers are handled by VitePress (and used for both the sidebar and document title).</p></div><h2 id="using-css-pre-processors"><a class="header-anchor" href="#using-css-pre-processors" aria-hidden="true">#</a> Using CSS Pre-processors</h2><p>VitePress has <a href="https://vitejs.dev/guide/features.html#css-pre-processors" target="_blank" rel="noopener noreferrer">built-in support</a> for CSS pre-processors: <code>.scss</code>, <code>.sass</code>, <code>.less</code>, <code>.styl</code> and <code>.stylus</code> files. There is no need to install Vite-specific plugins for them, but the corresponding pre-processor itself must be installed:</p><div class="language-"><pre><code># .scss and .sass\nnpm install -D sass\n\n# .less\nnpm install -D less\n\n# .styl and .stylus\nnpm install -D stylus\n</code></pre></div><p>Then you can use the following in Markdown and theme components:</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>sass<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">\n.title\n  <span class="token property">font-size</span><span class="token punctuation">:</span> 20px\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><h2 id="script-style-hoisting"><a class="header-anchor" href="#script-style-hoisting" aria-hidden="true">#</a> Script &amp; Style Hoisting</h2><p>Sometimes you may need to apply some JavaScript or CSS only to the current page. In those cases, you can directly write root-level <code>&lt;script&gt;</code> or <code>&lt;style&gt;</code> blocks in the Markdown file. These will be hoisted out of the compiled HTML and used as the <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> blocks for the resulting Vue single-file component:</p>',11),b=i('<h2 id="built-in-components"><a class="header-anchor" href="#built-in-components" aria-hidden="true">#</a> Built-In Components</h2><p>VitePress provides Built-In Vue Components like <code>ClientOnly</code> and <code>OutboundLink</code>, check out the [Global Component Guide] for more information.</p><p><strong>Also see:</strong></p><ul><li><a href="#using-components-in-headers">Using Components In Headers</a></li></ul><h2 id="browser-api-access-restrictions"><a class="header-anchor" href="#browser-api-access-restrictions" aria-hidden="true">#</a> Browser API Access Restrictions</h2><p>Because VitePress applications are server-rendered in Node.js when generating static builds, any Vue usage must conform to the <a href="https://ssr.vuejs.org/en/universal.html" target="_blank" rel="noopener noreferrer">universal code requirements</a>. In short, make sure to only access Browser / DOM APIs in <code>beforeMount</code> or <code>mounted</code> hooks.</p><p>If you are using or demoing components that are not SSR-friendly (for example, contain custom directives), you can wrap them inside the built-in <code>&lt;ClientOnly&gt;</code> component:</p><div class="language-md"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ClientOnly</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>NonSSRFriendlyComponent</span><span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ClientOnly</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p>Note this does not fix components or libraries that access Browser APIs <strong>on import</strong>. To use code that assumes a browser environment on import, you need to dynamically import them in proper lifecycle hooks:</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./lib-that-access-window-on-import&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token comment">// use code</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p>If your module <code>export default</code> a Vue component, you can register it dynamically:</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>component</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dynamicComponent<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:is</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dynamicComponent<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>component</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      dynamicComponent<span class="token operator">:</span> <span class="token keyword">null</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;./lib-that-access-window-on-import&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>dynamicComponent <span class="token operator">=</span> module<span class="token punctuation">.</span>default\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p><strong>Also see:</strong></p><ul><li><a href="https://v3.vuejs.org/guide/component-dynamic-async.html" target="_blank" rel="noopener noreferrer">Vue.js &gt; Dynamic Components</a></li></ul>',14);(u.__cssModules={}).$style=r,u.render=function(c,i,l,r,u,d){const T=a("ComponentInHeader"),_=a("StatisticsBox");return n(),s("div",null,[k,t(T),t(_,{name:"你好",value:"100",unit:"遍"}),g,t("div",h,[t("pre",null,[t("code",null,[(n(),s(e,null,o(3,(n=>t("span",null,p(n)+" ",1))),64))])])]),m,t("h3",y,[v,f,t(T)]),w,t("p",{class:["demo",c.$style.example]},null,2),b])};export default u;export{d as __pageData};

import{r as a,o as n,c as s,b as t,a as p}from"./app.b290997c.js";const o='{"title":"图标组件 @fssgis/icon","description":"","frontmatter":{},"headers":[{"level":2,"title":"介绍","slug":"介绍"},{"level":2,"title":"安装","slug":"安装"},{"level":2,"title":"使用","slug":"使用"},{"level":2,"title":"接口","slug":"接口"},{"level":3,"title":"FssgIcon","slug":"fssgicon"},{"level":2,"title":"案例","slug":"案例"},{"level":3,"title":"字体图标","slug":"字体图标"}],"relativePath":"guide/fssgis-icon.md","lastUpdated":1628346992864}',e={},c=p('<h1 id="图标组件-fssgis-icon"><a class="header-anchor" href="#图标组件-fssgis-icon" aria-hidden="true">#</a> 图标组件 @fssgis/icon</h1><h2 id="介绍"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>统一可复用的图标组件</p><h2 id="安装"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-shell"><pre><code><span class="token function">npm</span> <span class="token function">install</span> --save @fssgis/icon\n</code></pre></div><h2 id="使用"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><div class="language-js"><pre><code><span class="token keyword">import</span> FssgIcon <span class="token keyword">from</span> <span class="token string">&#39;@fssgis/icon&#39;</span>\n</code></pre></div><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n\t<span class="token attr-name">...</span>         \n<span class="token punctuation">/&gt;</span></span>\n</code></pre></div><h2 id="接口"><a class="header-anchor" href="#接口" aria-hidden="true">#</a> 接口</h2><h3 id="fssgicon"><a class="header-anchor" href="#fssgicon" aria-hidden="true">#</a> FssgIcon</h3><table><thead><tr><th>属性</th><th>类型</th><th>必要性</th><th>默认值</th><th>描述</th></tr></thead><tbody><tr><td>height</td><td><code>string</code> or <code>number</code></td><td>-</td><td>16px</td><td>图标高度</td></tr><tr><td>width</td><td><code>string</code> or <code>number</code></td><td>-</td><td>16px</td><td>图标宽度</td></tr><tr><td>url</td><td><code>string</code></td><td>-</td><td></td><td>图标内容（地址 or base64）</td></tr></tbody></table><h2 id="案例"><a class="header-anchor" href="#案例" aria-hidden="true">#</a> 案例</h2><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n\t<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n      <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>data:image/png;base64,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<span class="token punctuation">&quot;</span></span>        \n   <span class="token punctuation">/&gt;</span></span>\n\t<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n      <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://cdn.onlinewebfonts.com/svg/img_433041.png<span class="token punctuation">&quot;</span></span>        \n   <span class="token punctuation">/&gt;</span></span>\n\t<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n      <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://cdn.onlinewebfonts.com/svg/img_433041.png<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span>\n   <span class="token punctuation">/&gt;</span></span>\n\t<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n      <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://cdn.onlinewebfonts.com/svg/img_433041.png<span class="token punctuation">&quot;</span></span>   \n      <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>36px<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>36px<span class="token punctuation">&quot;</span></span>     \n   <span class="token punctuation">/&gt;</span></span>\n\t<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIcon</span>\n      <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://cdn.onlinewebfonts.com/svg/img_433041.png<span class="token punctuation">&quot;</span></span>   \n      <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>48px<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>48px<span class="token punctuation">&quot;</span></span>     \n   <span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> FssgIcon <span class="token keyword">from</span> <span class="token string">&#39;@fssgis/icon&#39;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  components<span class="token operator">:</span> <span class="token punctuation">{</span>\n    FssgIcon<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>  \n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',13),l=p('<h3 id="字体图标"><a class="header-anchor" href="#字体图标" aria-hidden="true">#</a> 字体图标</h3><link rel="stylesheet" href="https://at.alicdn.com/t/font_2728604_r31h4bhg9c.css?spm=a313x.7781069.1998910419.64&amp;file=font_2728604_r31h4bhg9c.css"><p>字体大小（尺寸）、颜色控制</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token string">&quot;@fssgis/icon/dist/iconfont.css&quot;</span> <span class="token comment">// or import a online css url</span>\n</code></pre></div><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>36px<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>48px<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>64px<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span> <span class="token attr-name">color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>red<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span> <span class="token attr-name">color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rgb(0, 0, 255)<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span> <span class="token attr-name">color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rgba(0, 255, 0, 1)<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FssgIconFont</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mouse<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>24px<span class="token punctuation">&quot;</span></span> <span class="token attr-name">color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>#43286775<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> FssgIconFont <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@fssgis/icon&#39;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',5);e.render=function(p,o,e,u,i,r){const k=a("FssgIcon"),g=a("FssgIconFont");return n(),s("div",null,[c,t(k,{url:"data:image/png;base64,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"}),t(k,{url:"http://cdn.onlinewebfonts.com/svg/img_433041.png"}),t(k,{url:"http://cdn.onlinewebfonts.com/svg/img_433041.png",width:"24px",height:"24px"}),t(k,{url:"http://cdn.onlinewebfonts.com/svg/img_433041.png",width:"36px",height:"36px"}),t(k,{url:"http://cdn.onlinewebfonts.com/svg/img_433041.png",width:"48px",height:"48px"}),t(k,{url:"http://cdn.onlinewebfonts.com/svg/img_433041.png",width:"64px",height:"64px"}),l,t(g,{name:"mouse"}),t(g,{name:"mouse",size:"24px"}),t(g,{name:"mouse",size:"36px"}),t(g,{name:"mouse",size:"48px"}),t(g,{name:"mouse",size:"64px"}),t(g,{name:"mouse",size:"24px",color:"red"}),t(g,{name:"mouse",size:"24px",color:"rgb(0, 0, 255)"}),t(g,{name:"mouse",size:"24px",color:"rgba(0, 255, 0, 1)"}),t(g,{name:"mouse",size:"24px",color:"#43286775"})])};export default e;export{o as __pageData};

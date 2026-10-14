const { DateTime } = require("luxon");

// 게시글 본문(Markdown)에서 쓰는 사이트 전용 강조 문법을 실제 색/크기 스타일로 바꿔준다.
//   [색=빨강]문구[/색]   -> <span style="color:#e53e3e">문구</span>  (또는 [색=#ff6600]처럼 직접 색상코드)
//   [크기=크게]문구[/크기] -> <span style="font-size:1.3em">문구</span> (또는 [크기=20px]처럼 직접 px)
// markdown-it의 핵심 파서가 돌기 전에 원본 텍스트를 치환하는 방식이라, 태그 안에 **볼드** 같은
// 일반 마크다운 문법이 섞여 있어도 그대로 함께 렌더링된다 (html:true가 Eleventy 기본값이라 가능).
const DODAN_COLOR_MAP = {
  빨강: "#e53e3e",
  주황: "#ed8936",
  노랑: "#ca8a04",
  초록: "#38a169",
  파랑: "#3182ce",
  남색: "#2c5282",
  보라: "#805ad5",
  분홍: "#d53f8c",
  검정: "#1a202c",
  회색: "#718096",
  갈색: "#8b5e34",
};

const DODAN_SIZE_MAP = {
  작게: "0.85em",
  보통: "1em",
  크게: "1.3em",
  아주크게: "1.7em",
};

function resolveDodanColor(raw) {
  const v = raw.trim();
  if (DODAN_COLOR_MAP[v]) return DODAN_COLOR_MAP[v];
  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v)) return v;
  return null;
}

function resolveDodanSize(raw) {
  const v = raw.trim();
  if (DODAN_SIZE_MAP[v]) return DODAN_SIZE_MAP[v];
  if (/^[0-9.]+(px|em|rem|%)$/.test(v)) return v;
  return null;
}

function dodanEmphasisShortcodes(md) {
  md.core.ruler.before("normalize", "dodan_emphasis_shortcodes", (state) => {
    state.src = state.src
      .replace(/\[색=([^\]]+)\]/g, (match, value) => {
        const color = resolveDodanColor(value);
        return color ? `<span style="color:${color}">` : match;
      })
      .replace(/\[\/색\]/g, "</span>")
      .replace(/\[크기=([^\]]+)\]/g, (match, value) => {
        const size = resolveDodanSize(value);
        return size ? `<span style="font-size:${size}">` : match;
      })
      .replace(/\[\/크기\]/g, "</span>");
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(dodanEmphasisShortcodes));


  // Static passthrough
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.addFilter("koDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Asia/Seoul" }).setLocale("ko").toFormat("yyyy.LL.dd");
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Asia/Seoul" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addCollection("notices", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/board/notices/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("deliveries", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/board/deliveries/*.md").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Only .njk (pages) and .md (posts) are templated. This matters because
    // src/admin/index.html (the Sveltia CMS entry point) must reach _site/
    // as a plain, untouched HTML file via passthrough copy — if "html" were
    // in this list, Eleventy would also try to process it as a template and
    // fight the passthrough copy for the same output path.
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

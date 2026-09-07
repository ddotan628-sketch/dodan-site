const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
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

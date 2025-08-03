import CleanCSS from "npm:clean-css";
import markdownIt from "npm:markdown-it";

export default function (eleventyConfig) {
    // eleventyConfig.addPassthroughCopy("_includes/pico.css");

    let options = {
        html: true,
        breaks: true,
        linkify: true,
    };

    eleventyConfig.setLibrary("md", markdownIt(options));
    eleventyConfig.setUseGitIgnore(false);

    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });
};


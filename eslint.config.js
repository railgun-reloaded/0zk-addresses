// # eslint.config.js
module.exports = {
  ...require("neostandard")({
    ts: true,
    ignores: require("neostandard").resolveIgnoresFromGitignore(),
  }),
};

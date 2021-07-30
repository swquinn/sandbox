const postcssImport = require('postcss-import')
const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  ident: 'postcss',
  plugins: [
    postcssImport({}),
    postcssPresetEnv({
      // stage 4 = Stable configuration of CSS (no experimental proposals)
      stage: 4,
      features: {
        // Don't use -ms-grid as it is a differents spec than the W3C standard
        autoprefixer: { grid: false },
      },
    }),
  ],
}

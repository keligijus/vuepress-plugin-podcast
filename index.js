const { buildXml, writeFile } = require('./lib/main')

module.exports = (options = {}, ctx) => ({
  async ready() {
    writeFile({
      outDir: ctx.outDir,
      filename: options.filename || 'podcast.xml',
      xml: buildXml({feedOptions: options.feedOptions, pages: ctx.pages})
    })
  },

  updated() {
    writeFile({
      outDir: ctx.outDir,
      filename: options.filename || 'podcast.xml',
      xml: buildXml({feedOptions: options.feedOptions, pages: ctx.pages})
    })
  }
})
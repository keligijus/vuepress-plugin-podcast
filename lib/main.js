const Podcast = require('podcast');
const path = require('path')
const fs = require('fs-extra')

module.exports = {
  writeFile({outDir, filename, xml}) {
    const feedFilePath = path.resolve(outDir, filename)
    fs.outputFileSync(feedFilePath, xml)
  },
  buildXml({feedOptions, pages}) {
    const feed = new Podcast(feedOptions)
    const defaultOptions = require('./defaultOptions')
    const podcastPagesFrontmatter = pages
      .filter(page => page.frontmatter.podcast)
      .map(page => {
        const frontmatter = page.frontmatter
        if (!frontmatter.guid) {
          frontmatter.guid = frontmatter.url
        }

        frontmatter.description = page._strippedContent

        return frontmatter
      })

    const podcastItems = podcastPagesFrontmatter
      .map(frontmatter => buildItems(defaultOptions.itemOptions, frontmatter));

    podcastItems.forEach(item => feed.addItem(item))


    return feed.buildXml();
  }
}

function buildItems (defaultOptions, itemOptions) {
  const result = {}

  Object.keys(defaultOptions).forEach(defaultOptKey => {
    if (typeof itemOptions[defaultOptKey] !== 'undefined') {
      result[defaultOptKey] = itemOptions[defaultOptKey]
    } else {
      if (defaultOptions[defaultOptKey].required === true) {
        throw new Error(`Podcast option **${defaultOptKey}** not provided!`)
      }
    }
  })

  return result;
}
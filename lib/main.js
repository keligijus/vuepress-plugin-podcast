const Podcast = require('podcast');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = {
  writeFile({outDir, filename, xml}) {
    const feedFilePath = path.resolve(outDir, filename)
    fs.writeFile(feedFilePath, xml)
    console.log(chalk.green.bold('Podcast XML has been generated!'))
  },
  buildXml({feedOptions, pages}) {
    const feed = new Podcast(feedOptions)
    const defaultOptions = require('./defaultOptions')
    const podcastPagesFrontmatter = pages
      .filter(page => page.frontmatter.podcast)
      .map(page => {
        const frontmatter = JSON.parse(JSON.stringify(page.frontmatter))
        const content = page._context.markdown.render(page._strippedContent).html

        frontmatter.content = frontmatter.content || content
        frontmatter.description = frontmatter.description || content

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
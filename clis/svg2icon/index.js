#!/usr/bin/env node
/* eslint-disable */

const svg2ttf = require('svg2ttf')
const svgicons2svgfont = require('svgicons2svgfont')
const fs = require('fs')
const { resolve} = require('path')



init(
  process.argv[process.argv.length - 3],
  process.argv[process.argv.length - 2],
  process.argv[process.argv.length - 1],
)

function init (inputSvgDir, outputTtf, inputMetadata) {
  const fontStream = new svgicons2svgfont({
    fontName: 'iconfont'
  })

  const temp = `svgfont${Date.now()}.svg`
  fontStream.pipe(
    fs.createWriteStream(temp).on('finish', () => {
      const ttf = svg2ttf(fs.readFileSync(temp, 'utf8'), {})
      fs.writeFileSync(outputTtf, Buffer.from(ttf.buffer))
    })
    .on('close', () => {
      fs.rm(temp, () => void 0)
    })
  )

  let metadata = fs.readFileSync(inputMetadata, { encoding: 'utf-8' })
  metadata = JSON.parse(metadata)

  const files = fs.readdirSync(inputSvgDir, { encoding: 'utf-8' })

  files.forEach(file => {
    const svg = fs.createReadStream(resolve(inputSvgDir, file))
    const name = file.replace('.svg', '')
    svg.metadata = {
      unicode: [metadata[name]],
      // unicode: ['\uE001'],
      name,
    }
    fontStream.write(svg)
  })

  fontStream.end()
}

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { Resvg } from '@resvg/resvg-js'

const svgPath = resolve('public/og-image.svg')
const outputPath = resolve('public/og-image.png')

const svg = readFileSync(svgPath, 'utf-8')

const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 1200,
  },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync(outputPath, pngBuffer)

console.log('OG image generated:', outputPath)

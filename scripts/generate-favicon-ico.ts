import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { Resvg } from '@resvg/resvg-js'

const svgPath = resolve('public/favicon.svg')
const outputPath = resolve('public/favicon.ico')

const svg = readFileSync(svgPath, 'utf-8')

// 32x32 PNG로 렌더링 (ICO 대신 PNG 사용 - 모던 브라우저 호환)
const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 32,
  },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync(outputPath, pngBuffer)

console.log('Favicon ICO generated:', outputPath)

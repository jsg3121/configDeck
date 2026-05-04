/**
 * SVG → PNG 변환 스크립트.
 *
 * SVG 원본은 빌드 산출물(public/) 외부인 scripts/og-templates/에 보관해 두고,
 * 변환된 PNG만 public/에 커밋한다. 이렇게 하면 SVG는 빌드 결과에 포함되지 않으면서
 * 디자인 원본은 추적 가능한 형태로 보존된다.
 *
 * 입력/출력 매핑:
 *   1. scripts/og-templates/og-image.svg → public/og-image.png (홈/기본 OG)
 *   2. scripts/og-templates/ai-config-*.svg → public/og/ai-config-*.png
 *      (페이지별 OG: 도구별 자식 랜딩 5종 + 카탈로그 허브 1종)
 *
 * 모든 SVG는 1200×630 viewBox 기준으로 작성되어 있다고 가정한다.
 *
 * 디자인 변경 시: SVG 수정 → `pnpm tsx scripts/generate-og-image.ts` 실행 → 갱신된 PNG 커밋.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { Resvg } from '@resvg/resvg-js'

const PROJECT_ROOT = resolve(import.meta.dirname, '..')
const TEMPLATES_DIR = resolve(PROJECT_ROOT, 'scripts/og-templates')
const PNG_TARGET_WIDTH = 1200

const renderSvgToPng = (svgPath: string, pngPath: string): void => {
  const svg = readFileSync(svgPath, 'utf-8')
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: PNG_TARGET_WIDTH },
    font: { loadSystemFonts: true },
  })
  const pngBuffer = resvg.render().asPng()
  writeFileSync(pngPath, pngBuffer)
  console.log(`✓ ${pngPath.replace(`${PROJECT_ROOT}/`, '')}`)
}

// 1. 홈/기본 OG 이미지 (public 루트로 출력)
renderSvgToPng(resolve(TEMPLATES_DIR, 'og-image.svg'), resolve(PROJECT_ROOT, 'public/og-image.png'))

// 2. 페이지별 OG 이미지 (ai-config-*.svg → public/og/*.png)
const pageSvgFiles = readdirSync(TEMPLATES_DIR).filter(
  (file) => file.endsWith('.svg') && file !== 'og-image.svg',
)

for (const svgFile of pageSvgFiles) {
  const svgPath = resolve(TEMPLATES_DIR, svgFile)
  const pngPath = resolve(PROJECT_ROOT, 'public/og', svgFile.replace(/\.svg$/, '.png'))
  renderSvgToPng(svgPath, pngPath)
}

console.log(`\nGenerated ${pageSvgFiles.length + 1} OG images.`)

/**
 * .gitignore 프리셋 목록.
 */
import type { Preset } from '@/types/generator'

export const gitignorePresets: Preset[] = [
  {
    name: 'Node',
    description: 'Node.js 프로젝트 기본 설정. 의존성, 빌드, 환경변수, macOS, VS Code를 제외합니다.',
    source: 'https://github.com/github/gitignore/blob/main/Node.gitignore',
    values: {
      node: true,
      build: true,
      env: true,
      macos: true,
      vscode: true,
    },
  },
  {
    name: 'Full Stack',
    description: '풀스택 프로젝트. Node + JetBrains IDE까지 포함합니다.',
    source: 'https://github.com/github/gitignore',
    values: {
      node: true,
      build: true,
      env: true,
      macos: true,
      vscode: true,
      jetbrains: true,
    },
  },
  {
    name: 'Minimal',
    description: '최소 설정. node_modules와 빌드 출력만 제외합니다.',
    source: 'https://github.com/github/gitignore/blob/main/Node.gitignore',
    values: {
      node: true,
      build: true,
    },
  },
]

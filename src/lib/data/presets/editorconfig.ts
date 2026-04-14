/**
 * EditorConfig 프리셋 목록.
 * ��리셋은 core 옵션만 포함한다.
 */
import type { Preset } from '@/types/generator'

export const editorconfigPresets: Preset[] = [
  {
    name: 'Standard',
    description: '2칸 스페이스, LF, UTF-8. 웹 프로젝트(JS/TS)에서 가장 보편적인 설정입니다.',
    source: 'https://editorconfig.org/#example-file',
    values: {
      indent_style: 'space',
      indent_size: 2,
      end_of_line: 'lf',
      charset: 'utf-8',
      trim_trailing_whitespace: true,
      insert_final_newline: true,
    },
  },
  {
    name: 'Tabs',
    description: '탭 들여쓰기. Go, Makefile 등 탭을 선호하는 생태계에 적합합니다.',
    source: 'https://editorconfig.org/#example-file',
    values: {
      indent_style: 'tab',
      indent_size: 4,
      end_of_line: 'lf',
      charset: 'utf-8',
      trim_trailing_whitespace: true,
      insert_final_newline: true,
    },
  },
  {
    name: '4-Space',
    description: '4칸 스페이스. Python, Java 등 4칸 들여쓰기를 사용하는 생태계에 적합합니다.',
    source: 'https://peps.python.org/pep-0008/#indentation',
    values: {
      indent_style: 'space',
      indent_size: 4,
      end_of_line: 'lf',
      charset: 'utf-8',
      trim_trailing_whitespace: true,
      insert_final_newline: true,
    },
  },
  {
    name: 'Minimal',
    description: '최소 설정. 들여쓰기와 인코딩만 지정합니다.',
    source: 'https://editorconfig.org/#example-file',
    values: {
      indent_style: 'space',
      indent_size: 2,
      charset: 'utf-8',
    },
  },
]

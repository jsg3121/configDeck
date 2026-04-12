/**
 * EditorConfig 설정 파일의 옵션 정의.
 * 공식 스펙: https://editorconfig.org
 * 속성 목록: https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties
 */
import type { FileOptionDefinition } from '@/types/generator'

const EDITORCONFIG_DOCS =
  'https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties'

export const editorconfigOptions: FileOptionDefinition = {
  slug: 'editorconfig',
  sections: [
    {
      title: '들여쓰기',
      titleEn: 'Indentation',
      description: '코드 들여쓰기 방식을 설정합니다.',
      descriptionEn: 'Configure code indentation style.',
      controls: [
        {
          type: 'radio',
          key: 'indent_style',
          label: '들여쓰기 방식',
          labelEn: 'Indent Style',
          description: '스페이스 또는 탭 중 하나를 선택합니다.',
          descriptionEn: 'Choose between space or tab indentation.',
          tier: 'core',
          rationale:
            '모든 EditorConfig 파일의 가장 기본적인 설정. indent_style + indent_size 조합이 핵심.',
          docsUrl: `${EDITORCONFIG_DOCS}#indent_style`,
          options: [
            { label: 'space', value: 'space' },
            { label: 'tab', value: 'tab' },
          ],
          default: 'space',
        },
        {
          type: 'number',
          key: 'indent_size',
          label: '들여쓰기 크기',
          labelEn: 'Indent Size',
          description: '들여쓰기에 사용할 스페이스 수입니다. tab 사용 시 tab_width로도 사용됩니다.',
          descriptionEn:
            'Number of spaces for indentation. Also used as tab_width when using tabs.',
          tier: 'core',
          rationale: '2칸(JS/TS 생태계)과 4칸(Python, Java)이 가장 보편적.',
          docsUrl: `${EDITORCONFIG_DOCS}#indent_size`,
          default: 2,
          step: 1,
          quickValues: [2, 4],
        },
        {
          type: 'number',
          key: 'tab_width',
          label: '탭 표시 너비',
          labelEn: 'Tab Width',
          description: '탭 문자의 표시 너비입니다. 생략 시 indent_size 값을 사용합니다.',
          descriptionEn: 'Display width of a tab character. Defaults to indent_size if omitted.',
          tier: 'advanced',
          docsUrl: `${EDITORCONFIG_DOCS}#tab_width`,
          default: 2,
          step: 1,
          quickValues: [2, 4, 8],
        },
      ],
    },
    {
      title: '줄바꿈 & 공백',
      titleEn: 'Line Endings & Whitespace',
      description: '줄바꿈 문자와 공백 처리를 설정합니다.',
      descriptionEn: 'Configure line endings and whitespace handling.',
      controls: [
        {
          type: 'select',
          key: 'end_of_line',
          label: '줄바꿈 문자',
          labelEn: 'End of Line',
          description: '파일의 줄바꿈 문자를 지정합니다. 크로스플랫폼 협업 시 중요합니다.',
          descriptionEn: 'Line ending style. Important for cross-platform collaboration.',
          tier: 'core',
          rationale: 'Git diff 오염 방지와 크로스플랫폼 일관성을 위해 lf가 표준.',
          docsUrl: `${EDITORCONFIG_DOCS}#end_of_line`,
          options: [
            { label: 'lf — Unix/macOS (\\n)', value: 'lf' },
            { label: 'crlf — Windows (\\r\\n)', value: 'crlf' },
            { label: 'cr — Classic Mac (\\r)', value: 'cr' },
          ],
          default: 'lf',
        },
        {
          type: 'checkbox',
          key: 'trim_trailing_whitespace',
          label: '후행 공백 제거',
          labelEn: 'Trim Trailing Whitespace',
          description: '줄 끝의 불필요한 공백을 저장 시 자동으로 제거합니다.',
          descriptionEn: 'Remove trailing whitespace on save.',
          tier: 'core',
          rationale: '대부분의 프로젝트에서 활성화. 불필요한 diff 방지.',
          docsUrl: `${EDITORCONFIG_DOCS}#trim_trailing_whitespace`,
          default: true,
        },
        {
          type: 'checkbox',
          key: 'insert_final_newline',
          label: '파일 끝 빈 줄',
          labelEn: 'Insert Final Newline',
          description: '파일 마지막에 빈 줄을 추가합니다. POSIX 표준 권장 사항입니다.',
          descriptionEn: 'Ensure file ends with a newline. Recommended by POSIX standard.',
          tier: 'core',
          rationale: 'POSIX 호환성. Git diff에서 "No newline at end of file" 경고 방지.',
          docsUrl: `${EDITORCONFIG_DOCS}#insert_final_newline`,
          default: true,
        },
      ],
    },
    {
      title: '인코딩 & 줄 길이',
      titleEn: 'Encoding & Line Length',
      description: '파일 인코딩과 최대 줄 길이를 설정합니다.',
      descriptionEn: 'Configure file encoding and maximum line length.',
      controls: [
        {
          type: 'select',
          key: 'charset',
          label: '문자 인코딩',
          labelEn: 'Charset',
          description: '파일의 문자 인코딩을 지정합니다.',
          descriptionEn: 'Character encoding of the file.',
          tier: 'core',
          rationale: 'utf-8이 사실상 웹 표준. 국제화 프로젝트에서 필수.',
          docsUrl: `${EDITORCONFIG_DOCS}#charset`,
          options: [
            { label: 'utf-8', value: 'utf-8' },
            { label: 'utf-8-bom', value: 'utf-8-bom' },
            { label: 'utf-16be', value: 'utf-16be' },
            { label: 'utf-16le', value: 'utf-16le' },
            { label: 'latin1', value: 'latin1' },
          ],
          default: 'utf-8',
        },
        {
          type: 'number',
          key: 'max_line_length',
          label: '최대 줄 길이',
          labelEn: 'Max Line Length',
          description: '한 줄의 최대 문자 수입니다. 에디터의 가이드라인/루러에 반영됩니다.',
          descriptionEn: 'Maximum line length. Reflected in editor rulers/guidelines.',
          tier: 'advanced',
          docsUrl: `${EDITORCONFIG_DOCS}#max_line_length`,
          default: 80,
          step: 1,
          quickValues: [80, 100, 120],
        },
      ],
    },
  ],
}

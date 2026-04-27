<script lang="ts">
  /**
   * 옵션 컨트롤 타입에 따라 적절한 컴포넌트를 렌더링하는 디스패처.
   * control.type에 따라 Radio, Checkbox, Select, Number, Text, Tags, KeyValue 중 하나를 렌더링한다.
   */
  import type { OptionControl } from '@/types/generator'

  import CheckboxControl from './controls/CheckboxControl.svelte'
  import KeyValueControl from './controls/KeyValueControl.svelte'
  import NumberControl from './controls/NumberControl.svelte'
  import RadioControl from './controls/RadioControl.svelte'
  import SelectControl from './controls/SelectControl.svelte'
  import TagsControl from './controls/TagsControl.svelte'
  import TextControl from './controls/TextControl.svelte'

  interface Props {
    control: OptionControl
    value: unknown
    locale: string
    highlighted: boolean
    onchange: (key: string, value: unknown) => void
  }

  let { control, value, locale, highlighted, onchange }: Props = $props()
</script>

<div
  id="control-{control.key}"
  class="transition-colors duration-500 {highlighted
    ? 'rounded-md bg-primary/5 p-2 ring-1 ring-primary/20'
    : ''}"
>
  {#if control.type === 'radio'}
    <RadioControl {control} value={value as string} {locale} {onchange} />
  {:else if control.type === 'checkbox'}
    <CheckboxControl {control} value={value as boolean} {locale} {onchange} />
  {:else if control.type === 'select'}
    <SelectControl {control} value={value as string} {locale} {onchange} />
  {:else if control.type === 'number'}
    <NumberControl {control} value={value as number | null} {locale} {onchange} />
  {:else if control.type === 'text'}
    <TextControl {control} value={value as string} {locale} {onchange} />
  {:else if control.type === 'tags'}
    <TagsControl {control} value={value as string[]} {locale} {onchange} />
  {:else if control.type === 'key-value'}
    <KeyValueControl {control} value={value as Record<string, string>} {locale} {onchange} />
  {/if}
</div>

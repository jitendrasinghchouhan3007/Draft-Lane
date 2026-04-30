export const editorActions = [
  {
    id: 'heading',
    label: 'H2',
    type: 'line-prefix',
    prefix: '## ',
    placeholder: 'Section title',
  },
  {
    id: 'bold',
    label: 'Bold',
    type: 'wrap',
    prefix: '**',
    suffix: '**',
    placeholder: 'bold text',
  },
  {
    id: 'italic',
    label: 'Italic',
    type: 'wrap',
    prefix: '_',
    suffix: '_',
    placeholder: 'emphasis',
  },
  {
    id: 'quote',
    label: 'Quote',
    type: 'line-prefix',
    prefix: '> ',
    placeholder: 'Quoted text',
  },
  {
    id: 'list',
    label: 'List',
    type: 'line-prefix',
    prefix: '- ',
    placeholder: 'List item',
  },
  {
    id: 'code',
    label: 'Code',
    type: 'block-wrap',
    prefix: '```\n',
    suffix: '\n```',
    placeholder: 'const sample = true;',
  },
]

function getSelectedText(content, selectionStart, selectionEnd, placeholder) {
  const selectedText = content.slice(selectionStart, selectionEnd)
  return selectedText || placeholder
}

export function applyRichTextAction(content, selectionStart, selectionEnd, action) {
  const beforeSelection = content.slice(0, selectionStart)
  const afterSelection = content.slice(selectionEnd)

  if (action.type === 'wrap' || action.type === 'block-wrap') {
    const selectedText = getSelectedText(content, selectionStart, selectionEnd, action.placeholder)
    const nextContent = `${beforeSelection}${action.prefix}${selectedText}${action.suffix}${afterSelection}`
    const nextSelectionStart = beforeSelection.length + action.prefix.length
    const nextSelectionEnd = nextSelectionStart + selectedText.length

    return {
      nextContent,
      nextSelectionStart,
      nextSelectionEnd,
    }
  }

  const selectedText = getSelectedText(content, selectionStart, selectionEnd, action.placeholder)
  const nextBlock = selectedText
    .split('\n')
    .map((line) => `${action.prefix}${line}`)
    .join('\n')

  const nextContent = `${beforeSelection}${nextBlock}${afterSelection}`
  const nextSelectionStart = beforeSelection.length
  const nextSelectionEnd = nextSelectionStart + nextBlock.length

  return {
    nextContent,
    nextSelectionStart,
    nextSelectionEnd,
  }
}
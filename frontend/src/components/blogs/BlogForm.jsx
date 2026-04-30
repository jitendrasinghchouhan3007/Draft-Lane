import { useRef, useState } from 'react'

import { applyRichTextAction, editorActions } from '../../utils/richText'
import MarkdownContent from './MarkdownContent'

const emptyValues = {
  title: '',
  tags: '',
  content: '',
}

function BlogForm({ initialValues = emptyValues, submitLabel, onSubmit, busy, error }) {
  const [values, setValues] = useState(initialValues)
  const [formError, setFormError] = useState('')
  const textareaRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function validateForm() {
    if (values.title.trim().length < 5) {
      return 'Title should be at least 5 characters long.'
    }

    if (values.content.trim().length < 30) {
      return 'Content should be at least 30 characters long.'
    }

    return ''
  }

  function handleToolbarAction(action) {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    const result = applyRichTextAction(
      values.content,
      textarea.selectionStart,
      textarea.selectionEnd,
      action,
    )

    setValues((currentValues) => ({
      ...currentValues,
      content: result.nextContent,
    }))

    window.requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(result.nextSelectionStart, result.nextSelectionEnd)
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextError = validateForm()

    if (nextError) {
      setFormError(nextError)
      return
    }

    setFormError('')

    await onSubmit({
      title: values.title.trim(),
      tags: values.tags,
      content: values.content.trim(),
    })
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <label className="field-group" htmlFor="title">
        <span>Title</span>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="Give the post a clear headline"
        />
      </label>

      <label className="field-group" htmlFor="tags">
        <span>Tags</span>
        <input
          id="tags"
          name="tags"
          type="text"
          value={values.tags}
          onChange={handleChange}
          placeholder="design, frontend, writing"
        />
      </label>

      <label className="field-group" htmlFor="content">
        <span>Content</span>
        <div className="editor-toolbar" aria-label="Formatting options">
          {editorActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="button button--ghost editor-toolbar__button"
              onClick={() => handleToolbarAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
        <p className="editor-toolbar__hint">Use the toolbar to add headings, emphasis, quotes, lists, or code blocks.</p>
        <textarea
          ref={textareaRef}
          id="content"
          name="content"
          value={values.content}
          onChange={handleChange}
          rows="14"
          placeholder="Write the full post here"
        />
      </label>

      <section className="editor-preview">
        <div className="section-header">
          <div>
            <p className="eyebrow">Live preview</p>
            <h2>Formatted content</h2>
          </div>
        </div>

        <MarkdownContent
          content={values.content.trim() || '_Start writing to see the rich text preview._'}
          className="markdown-content"
        />
      </section>

      {formError || error ? <p className="form-error">{formError || error}</p> : null}

      <div className="editor-form__actions">
        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default BlogForm
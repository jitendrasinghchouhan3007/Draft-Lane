export function getExcerpt(content) {
  const compactContent = content.replace(/\s+/g, ' ').trim()

  if (compactContent.length <= 180) {
    return compactContent
  }

  return `${compactContent.slice(0, 177).trimEnd()}...`
}

export function normalizeTags(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
  }

  if (typeof value === 'string') {
    return [...new Set(value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
  }

  return []
}
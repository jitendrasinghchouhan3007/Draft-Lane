import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { blogApi } from '../api/client'
import BlogCard from '../components/blogs/BlogCard'
import Pagination from '../components/blogs/Pagination'
import { useAuth } from '../hooks/useAuth'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const initialPagination = {
  page: 1,
  totalPages: 1,
  totalBlogs: 0,
}

function BlogListPage() {
  const { isAuthenticated } = useAuth()
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('paged')
  const [infinitePage, setInfinitePage] = useState(1)
  const [blogs, setBlogs] = useState([])
  const [tags, setTags] = useState([])
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMoreBlogs, setHasMoreBlogs] = useState(false)
  const [error, setError] = useState('')
  const loadMoreRef = useRef(null)

  const debouncedSearch = useDebouncedValue(searchText)

  function resetListState(nextMode = viewMode) {
    setBlogs([])
    setPagination(initialPagination)
    setLoading(true)
    setIsFetchingMore(false)
    setHasMoreBlogs(nextMode === 'infinite')
    setError('')
  }

  function handleSearchChange(event) {
    setSearchText(event.target.value)
    setPage(1)
    setInfinitePage(1)
    resetListState()
  }

  function handleTagChange(tag) {
    setSelectedTag(tag)
    setPage(1)
    setInfinitePage(1)
    resetListState()
  }

  function handlePageChange(nextPage) {
    setPage(nextPage)
    setLoading(true)
    setError('')
  }

  function handleViewModeChange(nextMode) {
    if (nextMode === viewMode) {
      return
    }

    setViewMode(nextMode)
    setPage(1)
    setInfinitePage(1)
    resetListState(nextMode)
  }

  useEffect(() => {
    const controller = new AbortController()
    const requestedPage = viewMode === 'infinite' ? infinitePage : page

    blogApi
      .list({ page: requestedPage, search: debouncedSearch, tag: selectedTag, signal: controller.signal })
      .then((data) => {
        setError('')
        const blogs = Array.isArray(data.blogs) ? data.blogs : []
        const pagination = data.pagination ?? initialPagination
        const tags = Array.isArray(data.tags) ? data.tags : []
        setBlogs((currentBlogs) => {
          if (viewMode !== 'infinite' || requestedPage === 1) {
            return blogs
          }

          const knownIds = new Set(currentBlogs.map((blog) => blog.id))
          const nextBlogs = blogs.filter((blog) => !knownIds.has(blog.id))
          return [...currentBlogs, ...nextBlogs]
        })
        setPagination(pagination)
        setTags(tags)
        setHasMoreBlogs(pagination.page < pagination.totalPages)
      })
      .catch((loadError) => {
        if (loadError.name === 'AbortError') {
          return
        }

        setError(loadError.message || 'Could not load blogs right now.')
      })
      .finally(() => {
        setLoading(false)
        setIsFetchingMore(false)
      })

    return () => {
      controller.abort()
    }
  }, [debouncedSearch, page, selectedTag, viewMode, infinitePage])

  useEffect(() => {
    if (viewMode !== 'infinite' || loading || isFetchingMore || !hasMoreBlogs) {
      return
    }

    const node = loadMoreRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setIsFetchingMore(true)
        setInfinitePage((currentPage) => currentPage + 1)
      },
      {
        rootMargin: '220px 0px',
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [hasMoreBlogs, isFetchingMore, loading, viewMode])

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Fresh from the archive</p>
          <h1>A comfortable place for long-form notes, sharp fixes, and the conversations that follow them.</h1>
          <p className="hero-panel__copy">
            Skim the latest posts, search by title, flip between pages or scroll mode, and drop into the comment threads when something is worth discussing.
          </p>
        </div>

        <div className="hero-panel__actions">
          {isAuthenticated ? (
            <Link to="/blogs/new" className="button">
              Write a new post
            </Link>
          ) : (
            <Link to="/register" className="button">
              Create an account
            </Link>
          )}
        </div>
      </section>

      <section className="surface-card surface-card--toolbar">
        <div className="toolbar-grid">
          <label className="field-group" htmlFor="blog-search">
            <span>Search by title</span>
            <input
              id="blog-search"
              type="search"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Try: architecture, design, frontend"
            />
          </label>

          <div className="tag-filter">
            <span className="tag-filter__label">Tags</span>
            <div className="tag-row">
              <button
                type="button"
                className={!selectedTag ? 'tag-pill tag-pill--active' : 'tag-pill'}
                onClick={() => handleTagChange('')}
              >
                all
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={selectedTag === tag ? 'tag-pill tag-pill--active' : 'tag-pill'}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="tag-filter">
            <span className="tag-filter__label">Browse mode</span>
            <div className="tag-row">
              <button
                type="button"
                className={viewMode === 'paged' ? 'tag-pill tag-pill--active' : 'tag-pill'}
                onClick={() => handleViewModeChange('paged')}
              >
                Pagination
              </button>
              <button
                type="button"
                className={viewMode === 'infinite' ? 'tag-pill tag-pill--active' : 'tag-pill'}
                onClick={() => handleViewModeChange('infinite')}
              >
                Infinite scroll
              </button>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="surface-card form-error">{error}</div> : null}

      {loading ? <div className="center-panel">Loading posts...</div> : null}

        {!loading && !error && !blogs.length ? (
        <section className="surface-card empty-state">
          <h2>No posts matched that view.</h2>
          <p>Try a shorter title search or clear the active tag filter.</p>
        </section>
      ) : null}

      {blogs.length > 0 ? (
        <>
          <div className="results-row">
            <p>{pagination.totalBlogs} posts found</p>
            <div className="results-row__actions">
              {viewMode === 'infinite' ? <span>Scroll down to load more posts automatically.</span> : null}
              {selectedTag ? (
                <button type="button" className="text-link" onClick={() => handleTagChange('')}>
                  Clear tag filter
                </button>
              ) : null}
            </div>
          </div>

          <section className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </section>

          {viewMode === 'paged' ? (
            <Pagination page={page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
          ) : (
            <div ref={loadMoreRef} className="infinite-scroll-sentinel" aria-hidden="true">
              {isFetchingMore ? 'Loading more posts...' : hasMoreBlogs ? 'More posts are on the way.' : 'You have reached the end.'}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

export default BlogListPage

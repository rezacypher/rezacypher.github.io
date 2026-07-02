(function(){
  "use strict";

  const blogsContainer = document.getElementById('blogsContainer');
  const searchInput = document.getElementById('searchInput');
  const pagination = document.getElementById('pagination');

  const BLOGS_PER_PAGE = 5;
  let currentPage = 1;
  let currentSearchTerm = '';

  // Helper
  function escapeHtml(text) {
    const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // Get filtered blogs based on search term
  function getFilteredBlogs() {
    const term = currentSearchTerm.toLowerCase().trim();
    if (!term) return window.blogData;
    return window.blogData.filter(blog => {
      const titleMatch = blog.title.toLowerCase().includes(term);
      const hashtagMatch = blog.hashtags.some(tag => tag.toLowerCase().includes(term));
      const shortMatch = blog.short.toLowerCase().includes(term);
      return titleMatch || hashtagMatch || shortMatch;
    });
  }

  // Render a single blog card (HTML string)
  function renderCard(blog) {
    const icon = blog.image || '📝';
    const isImage = blog.image && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(blog.image.trim());
    const imageHtml = isImage
      ? `<img src="img/blogs/${escapeHtml(blog.image)}" alt="${escapeHtml(blog.title)}" style="width:100%; height:100%; object-fit:cover;">`
      : `<div class="blog-image-placeholder">${escapeHtml(icon)}</div>`;

    const hashtagsHtml = blog.hashtags.map(tag => `<span class="hashtag">#${escapeHtml(tag)}</span>`).join('');

    const cardTag = blog.link ? 'a' : 'div';
    const cardAttrs = blog.link ? `href="${escapeHtml(blog.link)}" target="_blank" rel="noopener"` : '';

    return `
      <${cardTag} class="blog-card" ${cardAttrs}>
        <div class="blog-image">
          ${imageHtml}
        </div>
        <div class="blog-content">
          <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
          <div class="blog-hashtags">${hashtagsHtml}</div>
          <p class="blog-short">${escapeHtml(blog.short)}</p>
        </div>
      </${cardTag}>
    `;
  }

  // Render pagination buttons
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        if (currentPage !== i) {
          currentPage = i;
          renderBlogs();
        }
      });
      pagination.appendChild(btn);
    }
  }

  // Main render function
  function renderBlogs() {
    const filtered = getFilteredBlogs();
    const totalPages = Math.ceil(filtered.length / BLOGS_PER_PAGE);

    // Clamp current page if out of range
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * BLOGS_PER_PAGE;
    const pageBlogs = filtered.slice(start, start + BLOGS_PER_PAGE);

    if (pageBlogs.length === 0) {
      blogsContainer.innerHTML = `<div class="no-results">No blogs found matching “${escapeHtml(currentSearchTerm)}”</div>`;
    } else {
      blogsContainer.innerHTML = pageBlogs.map(blog => renderCard(blog)).join('');
    }

    renderPagination(totalPages);

    // Scroll to top of list after page change (optional)
    blogsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Search handler
  searchInput.addEventListener('input', () => {
    currentSearchTerm = searchInput.value;
    currentPage = 1;          // reset to first page on new search
    renderBlogs();
  });

  // Initial render
  renderBlogs();
})();
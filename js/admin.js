// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    loadAllFeedback();
});

// Load all feedback (admin view)
async function loadAllFeedback() {
    const listEl = document.getElementById('feedback-list');

    const result = await apiRequest('/api/feedback/all');
    if (!result) return;

    if (result.error) {
        listEl.innerHTML = '<p class="no-data">Error loading feedback.</p>';
        return;
    }

    const feedbacks = result.data;

    if (feedbacks.length === 0) {
        listEl.innerHTML = '<p class="no-data">No feedback submissions yet.</p>';
        return;
    }

    listEl.innerHTML = feedbacks.map(fb => {
        const userName = fb.userId ? fb.userId.name : 'Unknown';
        const userEmail = fb.userId ? fb.userId.email : '';
        return `
      <div class="feedback-item">
        <div>
          <span class="feedback-category">${escapeHtml(fb.category)}</span>
          <span class="feedback-meta">${formatDate(fb.createdAt)}</span>
        </div>
        <h3>${escapeHtml(fb.title)}</h3>
        <p class="feedback-description">${escapeHtml(fb.description)}</p>
        <p class="feedback-user">Submitted by: ${escapeHtml(userName)} (${escapeHtml(userEmail)})</p>
      </div>
    `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Auto-refresh every 30 seconds
setInterval(loadAllFeedback, 30000);

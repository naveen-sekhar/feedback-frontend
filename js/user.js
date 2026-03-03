// User Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    loadFeedback();

    document.getElementById('feedback-form').addEventListener('submit', submitFeedback);
    document.getElementById('edit-form').addEventListener('submit', saveEdit);
});

// Submit feedback
async function submitFeedback(e) {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!category || !title || !description) {
        showError('submit-error', 'All fields are required.');
        return;
    }

    const result = await apiRequest('/api/feedback', 'POST', { category, title, description });

    if (!result) return;

    if (result.error) {
        showError('submit-error', result.data.message);
        return;
    }

    showSuccess('submit-msg', 'Feedback submitted successfully!');
    document.getElementById('feedback-form').reset();
    loadFeedback();
}

// Load user's feedback
async function loadFeedback() {
    const listEl = document.getElementById('feedback-list');

    const result = await apiRequest('/api/feedback');
    if (!result) return;

    if (result.error) {
        listEl.innerHTML = '<p class="no-data">Error loading feedback.</p>';
        return;
    }

    const feedbacks = result.data;

    if (feedbacks.length === 0) {
        listEl.innerHTML = '<p class="no-data">No feedback submitted yet.</p>';
        return;
    }

    listEl.innerHTML = feedbacks.map(fb => {
        const timeInfo = getEditTimeInfo(fb.createdAt);
        return `
      <div class="feedback-item">
        <div>
          <span class="feedback-category">${escapeHtml(fb.category)}</span>
          <span class="feedback-meta">${formatDate(fb.createdAt)}</span>
        </div>
        <h3>${escapeHtml(fb.title)}</h3>
        <p class="feedback-description">${escapeHtml(fb.description)}</p>
        <p class="time-warning ${timeInfo.canEdit ? '' : 'time-expired'}">${timeInfo.message}</p>
        <div class="feedback-actions">
          <button class="btn btn-edit" onclick="openEditModal('${fb._id}', '${escapeAttr(fb.category)}', '${escapeAttr(fb.title)}', '${escapeAttr(fb.description)}')" ${timeInfo.canEdit ? '' : 'disabled'}>
            Edit
          </button>
          <button class="btn btn-delete" onclick="deleteFeedback('${fb._id}')">Delete</button>
        </div>
      </div>
    `;
    }).join('');
}

// Open edit modal
function openEditModal(id, category, title, description) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-error').classList.remove('show');
    document.getElementById('edit-modal').style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Save edited feedback
async function saveEdit(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const category = document.getElementById('edit-category').value;
    const title = document.getElementById('edit-title').value.trim();
    const description = document.getElementById('edit-description').value.trim();

    const result = await apiRequest(`/api/feedback/${id}`, 'PUT', { category, title, description });

    if (!result) return;

    if (result.error) {
        showError('edit-error', result.data.message);
        return;
    }

    closeEditModal();
    showSuccess('submit-msg', 'Feedback updated successfully!');
    loadFeedback();
}

// Delete feedback
async function deleteFeedback(id) {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    const result = await apiRequest(`/api/feedback/${id}`, 'DELETE');
    if (!result) return;

    if (result.error) {
        alert(result.data.message);
        return;
    }

    loadFeedback();
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Escape for use in HTML attributes
function escapeAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// Auto-refresh every 30 seconds to update time remaining
setInterval(loadFeedback, 30000);

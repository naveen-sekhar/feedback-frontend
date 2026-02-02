import { useState, useEffect } from 'react';

const FeedbackForm = ({ feedback, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (feedback) {
            setFormData({
                title: feedback.title || '',
                description: feedback.description || '',
                category: feedback.category || 'General'
            });
        }
    }, [feedback]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter feedback title"
                    required
                    maxLength={100}
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="General">General</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature Request</option>
                    <option value="Improvement">Improvement</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your feedback in detail"
                    required
                    maxLength={1000}
                    rows={5}
                />
            </div>

            <div className="modal-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (feedback ? 'Update Feedback' : 'Submit Feedback')}
                </button>
            </div>
        </form>
    );
};

export default FeedbackForm;

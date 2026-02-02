import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedbackCard from '../components/FeedbackCard';
import { feedbackAPI } from '../services/api';

const AdminDashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await feedbackAPI.getAll();
            setFeedbacks(response.data);
        } catch (err) {
            setError('Failed to load feedback');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = feedbacks.filter((feedback) => {
        if (filter === 'all') return true;
        return feedback.category === filter;
    });

    const stats = {
        total: feedbacks.length,
        bug: feedbacks.filter(f => f.category === 'Bug').length,
        feature: feedbacks.filter(f => f.category === 'Feature').length,
        improvement: feedbacks.filter(f => f.category === 'Improvement').length,
        general: feedbacks.filter(f => f.category === 'General').length
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="dashboard">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Admin Dashboard - All Feedback</h1>
                    <button className="btn btn-secondary" onClick={fetchFeedbacks}>
                        🔄 Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366f1' }}>
                            {stats.total}
                        </div>
                        <div style={{ color: '#64748b' }}>Total Feedback</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
                            {stats.bug}
                        </div>
                        <div style={{ color: '#64748b' }}>Bugs</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                            {stats.feature}
                        </div>
                        <div style={{ color: '#64748b' }}>Features</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                            {stats.improvement}
                        </div>
                        <div style={{ color: '#64748b' }}>Improvements</div>
                    </div>
                </div>

                {/* Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <select
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature</option>
                        <option value="Improvement">Improvement</option>
                        <option value="General">General</option>
                    </select>
                </div>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No Feedback Found</h3>
                        <p>
                            {filter === 'all'
                                ? 'No feedback has been submitted yet.'
                                : `No feedback in the "${filter}" category.`}
                        </p>
                    </div>
                ) : (
                    <div className="feedback-list">
                        {filteredFeedbacks.map((feedback) => (
                            <FeedbackCard
                                key={feedback._id}
                                feedback={feedback}
                                isAdmin={true}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

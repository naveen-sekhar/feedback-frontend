import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedbackCard from '../components/FeedbackCard';
import FeedbackForm from '../components/FeedbackForm';
import { feedbackAPI } from '../services/api';

const UserDashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleCreateFeedback = async (data) => {
        try {
            await feedbackAPI.create(data);
            setShowModal(false);
            setSuccessMessage('Feedback submitted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchFeedbacks();
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to create feedback');
        }
    };

    const handleEditFeedback = async (data) => {
        try {
            await feedbackAPI.update(editingFeedback._id, data);
            setShowModal(false);
            setEditingFeedback(null);
            setSuccessMessage('Feedback updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchFeedbacks();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update feedback';
            if (err.response?.data?.editWindowExpired) {
                setShowModal(false);
                setEditingFeedback(null);
                setError(message);
                setTimeout(() => setError(''), 5000);
                fetchFeedbacks();
            } else {
                throw new Error(message);
            }
        }
    };

    const handleDeleteFeedback = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await feedbackAPI.delete(id);
                setSuccessMessage('Feedback deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchFeedbacks();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete feedback');
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    const openEditModal = (feedback) => {
        setEditingFeedback(feedback);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingFeedback(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFeedback(null);
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="dashboard">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">My Feedback</h1>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        ➕ New Feedback
                    </button>
                </div>

                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3>No Feedback Yet</h3>
                        <p>Submit your first feedback to get started!</p>
                        <button className="btn btn-primary" onClick={openCreateModal}>
                            ➕ Submit Feedback
                        </button>
                    </div>
                ) : (
                    <div className="feedback-list">
                        {feedbacks.map((feedback) => (
                            <FeedbackCard
                                key={feedback._id}
                                feedback={feedback}
                                onEdit={openEditModal}
                                onDelete={handleDeleteFeedback}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingFeedback ? 'Edit Feedback' : 'New Feedback'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        {editingFeedback && (
                            <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                                ⚠️ Remember: You can only edit feedback within 15 minutes of submission!
                            </div>
                        )}

                        <FeedbackForm
                            feedback={editingFeedback}
                            onSubmit={editingFeedback ? handleEditFeedback : handleCreateFeedback}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;

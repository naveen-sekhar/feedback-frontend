import { useState, useEffect } from 'react';

const FeedbackCard = ({ feedback, onEdit, onDelete, isAdmin = false }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const createdAt = new Date(feedback.createdAt).getTime();
            const now = Date.now();
            const diffMs = (15 * 60 * 1000) - (now - createdAt); // 15 minutes in ms

            if (diffMs > 0) {
                const minutes = Math.floor(diffMs / 60000);
                const seconds = Math.floor((diffMs % 60000) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s left to edit`);
                setIsEditable(true);
            } else {
                setTimeLeft('Edit window expired');
                setIsEditable(false);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [feedback.createdAt]);

    const getCategoryClass = (category) => {
        const classes = {
            'Bug': 'category-bug',
            'Feature': 'category-feature',
            'Improvement': 'category-improvement',
            'General': 'category-general'
        };
        return classes[category] || 'category-general';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="feedback-card">
            <div className="feedback-header">
                <h3 className="feedback-title">{feedback.title}</h3>
                <span className={`feedback-category ${getCategoryClass(feedback.category)}`}>
                    {feedback.category}
                </span>
            </div>

            <p className="feedback-description">{feedback.description}</p>

            <div className="feedback-meta">
                <div>
                    {isAdmin && feedback.user && (
                        <span className="feedback-user">
                            👤 {feedback.user.name} ({feedback.user.email})
                        </span>
                    )}
                    <div className="feedback-time">
                        📅 {formatDate(feedback.createdAt)}
                    </div>
                </div>

                {!isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={isEditable ? 'time-warning' : 'time-expired'}>
                            ⏱ {timeLeft}
                        </span>
                        <div className="feedback-actions">
                            {isEditable && (
                                <button
                                    onClick={() => onEdit(feedback)}
                                    className="btn btn-secondary btn-sm"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(feedback._id)}
                                className="btn btn-danger btn-sm"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackCard;

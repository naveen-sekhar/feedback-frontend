import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar-brand">
                📝 FeedbackHub
            </Link>

            <div className="navbar-user">
                <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <span className={`user-role ${user?.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                        {user?.role}
                    </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

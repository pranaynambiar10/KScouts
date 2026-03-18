import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerDashboard from './PlayerDashboard';
import ClubDashboard from './ClubDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Decode JWT to get role (JWT payload is base64 encoded in the second segment)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role || 'player');
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);

    const renderDashboard = () => {
        switch (userRole) {
            case 'club':
                return <ClubDashboard />;
            case 'admin':
                return <AdminDashboard />;
            case 'player':
            default:
                return <PlayerDashboard />;
        }
    };

    if (!userRole) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl font-bold animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative">
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;

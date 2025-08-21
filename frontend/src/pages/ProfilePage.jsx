import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../components/api/axiosConfig';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaLock } from 'react-icons/fa';

const ProfilePage = () => {
    const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/profile/');
                setUser(response.data);
            } catch (error) {
                toast.error('Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleProfileChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put('/profile/', user);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put('/change-password/', passwordData);
            toast.success('Password changed successfully!');
            setPasswordData({ old_password: '', new_password: '' }); // Clear fields
        } catch (error) {
            toast.error(error.response?.data?.old_password?.[0] || 'Failed to change password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p className="text-center mt-8">Loading Profile...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6">
                <FaArrowLeft />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Update Information</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <input name="first_name" value={user.first_name} onChange={handleProfileChange} placeholder="First Name" className="form-input" />
                        <input name="last_name" value={user.last_name} onChange={handleProfileChange} placeholder="Last Name" className="form-input" />
                        <input name="email" type="email" value={user.email} onChange={handleProfileChange} placeholder="Email" className="form-input" />
                        <button type="submit" className="action-button bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                            <FaSave /> {isSubmitting ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>


                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input name="old_password" type="password" value={passwordData.old_password} onChange={handlePasswordChange} placeholder="Old Password" required className="form-input" />
                        <input name="new_password" type="password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="New Password" required className="form-input" />
                        <button type="submit" className="action-button bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                            <FaLock /> {isSubmitting ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
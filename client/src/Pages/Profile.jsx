import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4545/api/v1/user/profile', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setUser(response.data.user);
          setFormData({
            name: response.data.user.name,
            phoneNumber: response.data.user.phoneNumber
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile', { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        'http://localhost:4545/api/v1/user/profile',
        formData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!', { duration: 3000 });
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile', { duration: 3000 });
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{user?.name}</p>
              )}
            </div>
            
            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{user?.phoneNumber}</p>
              )}
            </div>
            
            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (cannot be edited)
              </label>
              <p className="p-2 bg-gray-50 rounded text-gray-500">{user?.email}</p>
            </div>
            
            {/* Role Field (Read-only) */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role (cannot be edited)
              </label>
              <p className="p-2 bg-gray-50 rounded text-gray-500">{user?.role}</p>
            </div>
            
           
            
            {/* Action Buttons */}
            <div className="flex justify-end pt-4 space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        phoneNumber: user.phoneNumber
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
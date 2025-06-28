import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardImg, Input, Button, Spinner } from 'reactstrap';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';

const API_URL = 'https://post-app-backend-8el3.onrender.com/api/user';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true); // Loader for current user
  const [followLoading, setFollowLoading] = useState({});
  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth', { replace: true });
      return;
    }
    const fetchCurrentUser = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
        setError(null);
      } catch {
        setError('Foydalanuvchi ma’lumotlari topilmadi');
      } finally {
        setUserLoading(false);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (searchQuery.trim() !== '') return;
    setLoading(true);
    axios
      .get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setError(null);
      })
      .catch(() => {
        setUsers([]);
        setError('Foydalanuvchilarni olishda xatolik');
      })
      .finally(() => setLoading(false));
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (searchQuery.trim() === '') return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setError(null);
      } catch {
        setUsers([]);
        setError('Foydalanuvchilarni qidirishda xatolik');
      }
      setLoading(false);
    }, 350);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const handleFollow = async (userId, isFollowing) => {
    setFollowLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const url = `${API_URL}/${isFollowing ? 'unfollow' : 'follow'}/${userId}`;
      const response = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (response.data.currentUser) {
        setCurrentUser(response.data.currentUser);
      } else if (response.data.following) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                following: response.data.following,
              }
            : prev
        );
      }
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isFollowed: !isFollowing }
            : user
        )
      );
      setError(null);
    } catch {
      setError('Follow/Unfollow qilishda xatolik');
    } finally {
      setFollowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const isFollowing = (userId) =>
    currentUser &&
    Array.isArray(currentUser.following) &&
    currentUser.following.some((id) => String(id) === String(userId));

  const filteredUsers = users.filter(
    (user) => !(currentUser && user._id === currentUser._id)
  );

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Foydalanuvchilar</h2>
        {userLoading ? (
          <div className="text-center"><Spinner size="lg" color="primary" /></div>
        ) : (
          <>
            {error && <div className="alert alert-danger">{error}</div>}
            <Input
              type="text"
              placeholder="Foydalanuvchi nomini qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="mt-4">
              {loading && <p className="text-center">Yuklanmoqda...</p>}
              {!loading && filteredUsers.length === 0 && (
                <p className="text-center">Foydalanuvchilar topilmadi</p>
              )}
              {filteredUsers.map((user) => (
                <Card
                  key={user._id}
                  className="mb-3"
                  style={{ cursor: 'pointer', background: '#f9f9f9', transition: '0.2s' }}
                >
                  <CardBody className="d-flex align-items-center">
                    <div onClick={() => handleUserClick(user._id)} className="d-flex align-items-center">
                      <CardImg
                        src={user.profileImage?.url ? user.profileImage.url : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740"}
                        alt="Profile"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          marginRight: '15px',
                          objectFit: 'cover',
                          background: '#e0e0e0'
                        }}
                      />
                      <CardTitle
                        tag="h5"
                        className="mb-0"
                        style={{ flex: 1, margin: 0 }}
                      >
                        {user.username}
                      </CardTitle>
                    </div>
                    <div>
                      {currentUser && user._id !== currentUser._id && (
                        <Button
                          color={isFollowing(user._id) ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => handleFollow(user._id, isFollowing(user._id))}
                          disabled={!!followLoading[user._id]}
                        >
                          {followLoading[user._id] ? (
                            <Spinner size="sm" color="secondary" />
                          ) : isFollowing(user._id) ? (
                            <>
                              <FaUserMinus /> Unfollow
                            </>
                          ) : (
                            <>
                              <FaUserPlus /> Follow
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserSearch;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from './ModalNotification';
import { NotificationContext } from './NotificationContex';
import {
  getNotifications,
  readNotification,
  deleteNotification,
  deleteAllNotifications,
} from '../api/notificationService';
import './styles.css';

const Notifications = () => {
  const { notifications, setNotifications, socket } = useContext(NotificationContext);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Username helper
  const getUsername = notif =>
    notif.senderId?.username ||
    notif.senderUsername ||
    (typeof notif.senderId === "string" ? notif.senderId : null) ||
    "Foydalanuvchi";

  useEffect(() => {
    if (!userId || !token) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/auth', { replace: true });
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getNotifications(userId, token);
        setNotifications(res.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/auth', { replace: true });
        }
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedNotification && !selectedNotification.isRead) {
      (async () => {
        try {
          await readNotification(selectedNotification._id, token);
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === selectedNotification._id
                ? { ...notif, isRead: true }
                : notif
            )
          );
          if (socket) {
            socket.emit('notificationRead', {
              notificationId: selectedNotification._id,
              userId
            });
          }
        } catch (err) {/* ignore */ }
      })();
    }
    // eslint-disable-next-line
  }, [selectedNotification]);

  const clearAll = async () => {
    if (window.confirm('Barcha bildirishnomalarni o‘chirishni xohlaysizmi?')) {
      try {
        await deleteAllNotifications(userId, token);
        setNotifications([]);
        setSelectedNotification(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/auth', { replace: true });
        }
      }
    }
  };

  const deleteOne = async (id) => {
    if (window.confirm('Barcha bildirishnomalarni o‘chirishni xohlaysizmi?')) {
      try {
        await deleteNotification(id, token);
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        if (selectedNotification?._id === id) setSelectedNotification(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/auth', { replace: true });
        } else {
          alert('Bildirishnomani o‘chirishda xatolik: ' + (err.response?.data?.message || err.message || 'Server xatosi'));
        }
      }
    }
  };

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
  };

  const handleUsernameClick = (senderId, e) => {
    e.stopPropagation();
    navigate(`/profile/${senderId}`);
  };

  return (
    <>
      <div className="notif-container">
        <div className="notif-box">
          {notifications.length === 0 ? (
            <p className="notif-empty">Hozircha bildirishnomalar yo‘q</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-content">
                  <span className="notif-icon">
                    {notif.type === 'follow'
                      ? '❤️'
                      : notif.type === 'comment'
                        ? '💬'
                        : '👍'}
                  </span>
                  <div className="notif-text">
                    <span
                      className="notif-username"
                      onClick={(e) => handleUsernameClick(
                        notif.senderId?._id || notif.senderId,
                        e
                      )}
                      style={{ cursor: 'pointer', color: '#007bff' }}
                    >
                      {getUsername(notif)}
                    </span>{' '}
                    {notif.message}
                    <p className="notif-time">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  className="notif-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOne(notif._id);
                  }}
                >
                  O‘chirish
                </button>
              </div>
            ))
          )}
          {notifications.length > 0 && (
            <button className="notif-clear-btn" onClick={clearAll}>
              Barchasini O‘chirish
            </button>
          )}
        </div>
        {selectedNotification && (
          <NotificationModal
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
      </div>
    </>
  );
};

export default Notifications;
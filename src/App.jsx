import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Notification from './components/Notification';
import Dashboard from './components/Dashboard';
import './index.css';

const App = ({ showDashboard = false }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Jeśli showDashboard jest true, renderujemy komponent Dashboard
  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="app">
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Logowanie"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoginModalOpen(false);
            showNotification('Zalogowano pomyślnie!', 'success');
          }}
        >
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-container">
              <i className="bx bx-envelope" aria-hidden="true"></i>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="Twój adres email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Hasło</label>
            <div className="auth-input-container">
              <i className="bx bx-lock-alt" aria-hidden="true"></i>
              <input
                type="password"
                id="password"
                className="auth-input"
                placeholder="Twoje hasło"
                required
              />
            </div>
          </div>

          <div className="auth-remember">
            <div className="remember-checkbox">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Zapamiętaj mnie</label>
            </div>
            <a href="#" className="auth-forgot">
              Zapomniałeś hasła?
            </a>
          </div>

          <button type="submit" className="auth-btn">
            Zaloguj się
          </button>
        </form>

        <div className="auth-divider">lub</div>

        <button className="social-btn google">
          <i className="bx bxl-google" aria-hidden="true"></i>
          <span>Zaloguj przez Google</span>
        </button>

        <button className="social-btn facebook">
          <i className="bx bxl-facebook-circle" aria-hidden="true"></i>
          <span>Zaloguj przez Facebook</span>
        </button>

        <div className="auth-footer">
          Nie masz jeszcze konta?{' '}
          <button
            className="switch-modal"
            onClick={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
          >
            Zarejestruj się
          </button>
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Rejestracja"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsRegisterModalOpen(false);
            showNotification('Konto zostało utworzone!', 'success');
          }}
        >
          <div className="auth-field">
            <label htmlFor="fullname">Imię i nazwisko</label>
            <div className="auth-input-container">
              <i className="bx bx-user" aria-hidden="true"></i>
              <input
                type="text"
                id="fullname"
                className="auth-input"
                placeholder="Twoje imię i nazwisko"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <div className="auth-input-container">
              <i className="bx bx-envelope" aria-hidden="true"></i>
              <input
                type="email"
                id="reg-email"
                className="auth-input"
                placeholder="Twój adres email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Hasło</label>
            <div className="auth-input-container">
              <i className="bx bx-lock-alt" aria-hidden="true"></i>
              <input
                type="password"
                id="reg-password"
                className="auth-input"
                placeholder="Utwórz hasło"
                required
              />
            </div>
          </div>

          <div className="auth-remember">
            <div className="remember-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Akceptuję <a href="#">Regulamin</a> oraz{' '}
                <a href="#">Politykę prywatności</a>
              </label>
            </div>
          </div>

          <button type="submit" className="auth-btn">
            Zarejestruj się
          </button>
        </form>

        <div className="auth-divider">lub</div>

        <button className="social-btn google">
          <i className="bx bxl-google" aria-hidden="true"></i>
          <span>Zarejestruj przez Google</span>
        </button>

        <button className="social-btn facebook">
          <i className="bx bxl-facebook-circle" aria-hidden="true"></i>
          <span>Zarejestruj przez Facebook</span>
        </button>

        <div className="auth-footer">
          Masz już konto?{' '}
          <button
            className="switch-modal"
            onClick={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          >
            Zaloguj się
          </button>
        </div>
      </Modal>

      {/* Notifications Container */}
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <Notification
            key={id}
            message={message}
            type={type}
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App; 
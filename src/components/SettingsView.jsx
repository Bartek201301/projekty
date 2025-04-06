import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  RefreshCw, 
  Moon, 
  Sun, 
  Bell, 
  User, 
  Shield, 
  Clock,
  UserCircle
} from 'lucide-react';

const SettingsView = () => {
  // Stan dla aktualnie wybranej sekcji
  const [activeSection, setActiveSection] = useState('profil');
  
  // Stany dla ustawień aplikacji
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'pl',
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      deadlineAlerts: true,
    },
    profileInfo: {
      displayName: 'Bartek',
      email: 'bartek@example.com',
      avatar: 'https://via.placeholder.com/200/1a1a2e/FFFFFF?text=B',
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    appearance: {
      compactMode: false,
      reducedMotion: false,
      fontSize: 'normal',
    },
    timePreferences: {
      workingHours: {
        start: '09:00',
        end: '17:00',
      },
      workDays: [1, 2, 3, 4, 5], // Poniedziałek - Piątek
      timeFormat: '24h',
    }
  });

  // Funkcja aktualizująca ustawienia
  const updateSettings = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  // Funkcja obsługująca przełączanie przełączników
  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  // Zapisz ustawienia (tutaj tylko symulacja)
  const saveSettings = () => {
    // W przyszłości: komunikacja z backendem
    alert('Ustawienia zostały zapisane');
  };

  // Reset ustawień do domyślnych
  const resetSettings = () => {
    if (confirm('Czy na pewno chcesz przywrócić ustawienia domyślne?')) {
      // Tutaj logika resetowania (placeholder)
    }
  };

  // Renderowanie sekcji profilu
  const renderProfileSection = () => (
    <motion.section
      id="profil"
      className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Profil</h2>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="h-32 w-32 rounded-full overflow-hidden mb-3 bg-dark-200 flex items-center justify-center">
            {settings.profileInfo.avatar ? (
              <img 
                src={settings.profileInfo.avatar} 
                alt="Avatar" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : (
              <UserCircle size={80} className="text-gray-400" />
            )}
          </div>
          <button className="text-sm text-primary hover:underline">
            Zmień zdjęcie
          </button>
        </div>
        <div className="md:w-2/3 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nazwa wyświetlana</label>
            <input 
              type="text" 
              value={settings.profileInfo.displayName}
              onChange={(e) => updateSettings('profileInfo', 'displayName', e.target.value)}
              className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={settings.profileInfo.email}
              onChange={(e) => updateSettings('profileInfo', 'email', e.target.value)}
              className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );

  // Renderowanie sekcji powiadomień
  const renderNotificationsSection = () => (
    <motion.section
      id="powiadomienia"
      className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Powiadomienia</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Powiadomienia email</h3>
            <p className="text-gray-400 text-sm">Otrzymuj aktualizacje na swój adres email</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="email-notifications" 
              className="sr-only"
              checked={settings.notifications.email}
              onChange={() => handleToggle('notifications', 'email')}
            />
            <label 
              htmlFor="email-notifications"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.notifications.email ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.notifications.email ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Powiadomienia push</h3>
            <p className="text-gray-400 text-sm">Otrzymuj powiadomienia w przeglądarce</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="push-notifications" 
              className="sr-only"
              checked={settings.notifications.push}
              onChange={() => handleToggle('notifications', 'push')}
            />
            <label 
              htmlFor="push-notifications"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.notifications.push ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.notifications.push ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Przypomnienia o zadaniach</h3>
            <p className="text-gray-400 text-sm">Przypomnienia o nadchodzących zadaniach</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="task-reminders" 
              className="sr-only"
              checked={settings.notifications.taskReminders}
              onChange={() => handleToggle('notifications', 'taskReminders')}
            />
            <label 
              htmlFor="task-reminders"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.notifications.taskReminders ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.notifications.taskReminders ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
      </div>
    </motion.section>
  );

  // Renderowanie sekcji bezpieczeństwa
  const renderSecuritySection = () => (
    <motion.section
      id="bezpieczenstwo"
      className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Bezpieczeństwo</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Weryfikacja dwuetapowa</h3>
            <p className="text-gray-400 text-sm">Zwiększ bezpieczeństwo swojego konta</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="two-factor" 
              className="sr-only"
              checked={settings.security.twoFactorAuth}
              onChange={() => handleToggle('security', 'twoFactorAuth')}
            />
            <label 
              htmlFor="two-factor"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.security.twoFactorAuth ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.security.twoFactorAuth ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Czas wygaśnięcia sesji</h3>
          <p className="text-gray-400 text-sm mb-3">Po jakim czasie braku aktywności zostaniesz wylogowany</p>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={15}>15 minut</option>
            <option value={30}>30 minut</option>
            <option value={60}>1 godzina</option>
            <option value={120}>2 godziny</option>
            <option value={0}>Nigdy</option>
          </select>
        </div>
        
        <div className="pt-3">
          <button className="text-primary hover:underline text-sm font-medium">
            Zmień hasło
          </button>
        </div>
      </div>
    </motion.section>
  );

  // Renderowanie sekcji wyglądu
  const renderAppearanceSection = () => (
    <motion.section
      id="wyglad"
      className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Wygląd</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-white font-medium mb-2">Motyw</h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center ${settings.theme === 'dark' ? 'border-primary' : 'border-dark-100 hover:border-gray-500'}`}
              onClick={() => setSettings({...settings, theme: 'dark'})}
            >
              <div className="w-12 h-12 rounded-full bg-dark-200 flex items-center justify-center mb-2">
                <Moon size={24} className="text-primary" />
              </div>
              <span className="text-white">Ciemny</span>
            </div>
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center ${settings.theme === 'light' ? 'border-primary' : 'border-dark-100 hover:border-gray-500'}`}
              onClick={() => setSettings({...settings, theme: 'light'})}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <Sun size={24} className="text-yellow-500" />
              </div>
              <span className="text-white">Jasny</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Tryb kompaktowy</h3>
            <p className="text-gray-400 text-sm">Zmniejsz odstępy, aby wyświetlić więcej treści</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="compact-mode" 
              className="sr-only"
              checked={settings.appearance.compactMode}
              onChange={() => handleToggle('appearance', 'compactMode')}
            />
            <label 
              htmlFor="compact-mode"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.appearance.compactMode ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.appearance.compactMode ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-white font-medium">Redukcja animacji</h3>
            <p className="text-gray-400 text-sm">Zmniejsz ilość animacji w interfejsie</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="reduced-motion" 
              className="sr-only"
              checked={settings.appearance.reducedMotion}
              onChange={() => handleToggle('appearance', 'reducedMotion')}
            />
            <label 
              htmlFor="reduced-motion"
              className={`block w-14 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${settings.appearance.reducedMotion ? 'bg-primary' : 'bg-dark-200'}`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${settings.appearance.reducedMotion ? 'transform translate-x-7' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Rozmiar czcionki</h3>
          <select
            value={settings.appearance.fontSize}
            onChange={(e) => updateSettings('appearance', 'fontSize', e.target.value)}
            className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="small">Mały</option>
            <option value="normal">Standardowy</option>
            <option value="large">Duży</option>
            <option value="x-large">Bardzo duży</option>
          </select>
        </div>
      </div>
    </motion.section>
  );

  // Renderowanie sekcji preferencji czasu
  const renderTimePreferencesSection = () => (
    <motion.section
      id="czas"
      className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Preferencje czasu</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-white font-medium mb-2">Godziny pracy</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Od</label>
              <input 
                type="time" 
                value={settings.timePreferences.workingHours.start}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    timePreferences: {
                      ...settings.timePreferences,
                      workingHours: {
                        ...settings.timePreferences.workingHours,
                        start: e.target.value
                      }
                    }
                  });
                }}
                className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Do</label>
              <input 
                type="time" 
                value={settings.timePreferences.workingHours.end}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    timePreferences: {
                      ...settings.timePreferences,
                      workingHours: {
                        ...settings.timePreferences.workingHours,
                        end: e.target.value
                      }
                    }
                  });
                }}
                className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Dni robocze</h3>
          <div className="flex flex-wrap gap-2">
            {['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'].map((day, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${settings.timePreferences.workDays.includes(index) 
                    ? 'bg-primary text-white' 
                    : 'bg-dark-200 text-gray-400 hover:bg-dark-100'}`}
                onClick={() => {
                  const newWorkDays = settings.timePreferences.workDays.includes(index)
                    ? settings.timePreferences.workDays.filter(d => d !== index)
                    : [...settings.timePreferences.workDays, index];
                  
                  setSettings({
                    ...settings,
                    timePreferences: {
                      ...settings.timePreferences,
                      workDays: newWorkDays
                    }
                  });
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Format czasu</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="timeFormat"
                checked={settings.timePreferences.timeFormat === '12h'}
                onChange={() => setSettings({
                  ...settings,
                  timePreferences: {
                    ...settings.timePreferences,
                    timeFormat: '12h'
                  }
                })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${settings.timePreferences.timeFormat === '12h' ? 'border-primary' : 'border-gray-400'}`}>
                {settings.timePreferences.timeFormat === '12h' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <span className="text-white">12-godzinny (AM/PM)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="timeFormat"
                checked={settings.timePreferences.timeFormat === '24h'}
                onChange={() => setSettings({
                  ...settings,
                  timePreferences: {
                    ...settings.timePreferences,
                    timeFormat: '24h'
                  }
                })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${settings.timePreferences.timeFormat === '24h' ? 'border-primary' : 'border-gray-400'}`}>
                {settings.timePreferences.timeFormat === '24h' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <span className="text-white">24-godzinny</span>
            </label>
          </div>
        </div>
      </div>
    </motion.section>
  );

  // Renderowanie aktywnej sekcji na podstawie stanu
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profil':
        return renderProfileSection();
      case 'powiadomienia':
        return renderNotificationsSection();
      case 'bezpieczenstwo':
        return renderSecuritySection();
      case 'wyglad':
        return renderAppearanceSection();
      case 'czas':
        return renderTimePreferencesSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Ustawienia
        </h1>
        <p className="text-gray-400 mt-1">
          Dostosuj TimeManager do swoich potrzeb
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel nawigacji ustawień */}
        <div className="lg:col-span-3">
          <div className="bg-dark-100/50 backdrop-blur-sm p-4 rounded-xl border border-dark-100/80 sticky top-4">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSection('profil')}
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${activeSection === 'profil' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
              >
                <User size={18} className="mr-2" />
                <span>Profil</span>
              </button>
              <button 
                onClick={() => setActiveSection('powiadomienia')}
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${activeSection === 'powiadomienia' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
              >
                <Bell size={18} className="mr-2" />
                <span>Powiadomienia</span>
              </button>
              <button 
                onClick={() => setActiveSection('bezpieczenstwo')}
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${activeSection === 'bezpieczenstwo' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
              >
                <Shield size={18} className="mr-2" />
                <span>Bezpieczeństwo</span>
              </button>
              <button 
                onClick={() => setActiveSection('wyglad')}
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${activeSection === 'wyglad' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
              >
                <Moon size={18} className="mr-2" />
                <span>Wygląd</span>
              </button>
              <button 
                onClick={() => setActiveSection('czas')}
                className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${activeSection === 'czas' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
              >
                <Clock size={18} className="mr-2" />
                <span>Preferencje czasu</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Główny panel ustawień */}
        <div className="lg:col-span-9">
          {/* Renderowanie aktywnej sekcji */}
          {renderActiveSection()}
          
          {/* Przyciski akcji - przeniesione na dół */}
          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              className="flex items-center bg-dark-100 hover:bg-dark-200 text-white px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetSettings}
            >
              <RefreshCw size={16} className="mr-2" />
              <span>Resetuj</span>
            </motion.button>
            <motion.button
              className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
            >
              <Save size={16} className="mr-2" />
              <span>Zapisz zmiany</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView; 
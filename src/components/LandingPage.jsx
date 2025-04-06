import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-300 text-white">
      {/* Nagłówek / Navigation */}
      <header className="py-4 px-6 md:px-12 lg:px-24 flex justify-between items-center">
        <div className="flex items-center">
          <Clock size={28} className="text-primary mr-2" />
          <span className="text-xl font-bold">TimeManager</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition">Funkcje</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition">Jak to działa</a>
          <a href="#roadmap" className="text-gray-300 hover:text-white transition">Roadmapa</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition">Kontakt</a>
        </nav>
        <div className="flex space-x-4">
          <a href="/dashboard" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
            Logowanie
          </a>
          <button className="bg-transparent border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition">
            Utwórz konto
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Zwiększ swoją <span className="text-primary">produktywność</span> <br />
          dzięki inteligentnemu zarządzaniu czasem
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          TimeManager pomaga planować zadania, monitorować postępy i osiągać lepsze wyniki dzięki nowoczesnym narzędziom do zarządzania czasem.
        </motion.p>
        <motion.div 
          className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="/dashboard" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all"
          >
            Rozpocznij za darmo
          </a>
          <a 
            href="#how-it-works" 
            className="bg-dark-200 hover:bg-dark-100 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all"
          >
            Zobacz jak to działa
          </a>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-dark-200">
        <div className="px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">87%</h3>
              <p className="text-gray-300">Wzrost produktywności</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">35%</h3>
              <p className="text-gray-300">Mniej stresu</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">2.5h</h3>
              <p className="text-gray-300">Oszczędność czasu dziennie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Intuicyjny dashboard zaprojektowany dla Ciebie</h2>
            <p className="text-lg text-gray-300 mb-8">
              Nasz dashboard daje Ci pełny przegląd Twoich zadań, projektów i celów. Monitoruj postępy, zarządzaj priorytetami i zwiększaj swoją wydajność każdego dnia.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded text-primary mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Zarządzanie zadaniami</h4>
                  <p className="text-gray-400">Twórz, edytuj i monitoruj zadania z elastycznymi opcjami grupowania.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded text-primary mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Listy i checklisty</h4>
                  <p className="text-gray-400">Organizuj swoje zadania za pomocą intuicyjnych list i grup.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded text-primary mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Analityka i raporty</h4>
                  <p className="text-gray-400">Śledź swoją wydajność dzięki szczegółowym wykrsom i statystykom.</p>
                </div>
              </li>
            </ul>
            <a href="/dashboard" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all">
              Wypróbuj dashboard
            </a>
          </div>
          <div className="lg:w-1/2">
            <img src="https://via.placeholder.com/600x400/1a1a2e/FFFFFF?text=Dashboard+Preview" alt="Dashboard Preview" className="rounded-xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-400 py-12 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Clock size={24} className="text-primary mr-2" />
            <span className="text-lg font-bold">TimeManager</span>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TimeManager. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
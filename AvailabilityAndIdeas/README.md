# Dostępność i Pomysły

Aplikacja umożliwiająca grupie 15 znajomych zaznaczanie wspólnej dostępności, dzielenie się pomysłami na spędzanie czasu oraz przechowywanie zdjęć z wydarzeń.

## Funkcje

- Logowanie dla zamkniętej grupy 15 użytkowników
- Kalendarz z oznaczeniem dostępności
- Dodawanie pomysłów na spędzanie wspólnego czasu
- Przeglądanie dostępności innych użytkowników
- Dodawanie i przeglądanie zdjęć z wydarzeń
- Komentowanie pomysłów i zdjęć
- Profile użytkowników ze statusami
- Powiadomienia o aktywnościach (opcjonalnie)

## Technologie

- React Native
- Firebase (Authentication, Firestore, Storage)
- Expo

## Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie aplikacji
npm start
```

## Architektura aplikacji

```
src/
  ├── assets/         # Grafiki, ikony, zasoby statyczne
  ├── components/     # Komponenty współdzielone
  ├── navigation/     # Nawigacja aplikacji
  ├── screens/        # Ekrany aplikacji
  └── services/       # Usługi (API, Firebase, etc.)
``` 
# SnapCal - Tryb demonstracyjny

Ten dokument wyjaśnia, jak uruchomić aplikację SnapCal w trybie demonstracyjnym, który korzysta z zaślepek (mocków) zamiast prawdziwej bazy danych Firebase. Jest to przydatne do szybkiego testowania interfejsu użytkownika i podstawowych funkcjonalności aplikacji bez konieczności konfigurowania pełnego środowiska Firebase.

## Konfiguracja trybu demonstracyjnego

Aplikacja jest już skonfigurowana do działania w trybie demonstracyjnym. W tym trybie:

1. Wszystkie dane są symulowane lokalnie (nie ma połączenia z Firebase)
2. Możesz przeglądać przykładowe grupy, zdjęcia i komentarze
3. Interakcje są zachowane (możesz klikać przyciski, nawigować między ekranami)
4. Zmiany nie są trwałe (po ponownym uruchomieniu aplikacji wszystko wraca do stanu początkowego)

## Uruchamianie aplikacji

1. Zainstaluj zależności (jeśli jeszcze tego nie zrobiłeś):
   ```bash
   npm install
   ```

2. Upewnij się, że tryb demonstracyjny jest włączony:
   - Otwórz plik `src/services/firebaseConfig.js`
   - Upewnij się, że `USE_MOCK_FIREBASE` jest ustawione na `true`

3. Uruchom aplikację:
   ```bash
   expo start
   ```

4. Testuj aplikację na urządzeniu fizycznym lub emulatorze:
   - Zeskanuj kod QR za pomocą aplikacji Expo Go (iOS/Android)
   - Lub naciśnij `a` (Android) lub `i` (iOS) w terminalu, aby uruchomić aplikację na emulatorze

## Przykładowe dane

W trybie demonstracyjnym będziesz mieć dostęp do następujących danych:

### Użytkownicy:
- Test User (Ty) - zalogowany jako domyślny użytkownik
- Alice Johnson
- Bob Smith

### Grupy:
- "Family Photos" - grupa rodzinna z 3 członkami
- "Vacation 2023" - grupa wakacyjna z 2 członkami

### Zdjęcia:
- Przykładowe zdjęcia w każdej grupie
- Kilka zdjęć ma również komentarze i polubienia

## Przełączanie na prawdziwy Firebase

Gdy będziesz gotowy do przejścia na prawdziwy Firebase:

1. Utwórz projekt w Firebase Console (console.firebase.google.com)
2. Uzyskaj dane konfiguracyjne Firebase
3. Uzupełnij dane konfiguracyjne w pliku `src/services/firebaseConfig.js`
4. Zmień `USE_MOCK_FIREBASE` na `false` w tym samym pliku
5. Uruchom aplikację ponownie

## Notatki dla deweloperów

Pliki związane z trybem demonstracyjnym:
- `src/services/firebaseConfig.js` - kontroluje, czy używamy mocków czy prawdziwego Firebase
- `src/services/firebaseMock.js` - zawiera wszystkie funkcje zaślepkowe i przykładowe dane
- `src/services/firebase.js` - główny plik, który eksportuje odpowiednie implementacje w zależności od konfiguracji

Jeśli dodajesz nowe funkcjonalności, które korzystają z Firebase, pamiętaj o dodaniu odpowiednich mocków w pliku `firebaseMock.js`, aby aplikacja działała poprawnie również w trybie demonstracyjnym. 
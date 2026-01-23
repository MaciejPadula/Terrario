# **Product Requirements Document (PRD)**  
**Projekt**: **Terrario**  
**Wersja**: 1.0  
**Data**: 2025-10-29
**Autor**: Maciej Padula

---

## **1. Cel produktu**

Głównym celem projektu jest stworzenia aplikacji umożliwiającej prowadzenie ewidencji zwierząt terrarystycznych jakie posiadamy w domu. Możnaby zapisywać jakie zwierzęta z predefiniowanych gatunków posiadamy oraz jakie będziemy chcieli mieć w przyszłości. Dodatkowo pojawi się asystent AI pomagający w wyborze nowego zwierzaka.

---

## **2. Wizja produktu**

Aplikacja ma pomóc w prowadzeniu ewidencji zwierząt terrarystycznych. Funkcjonalności jakie zostały przewidziane:

- zarządzanie użytkownikami - logowanie, rejestracja
- tworzenie list posiadanych zwierząt
- dodawanie zwierząt do list
- usuwanie zwierząt z list
- każde zwierze może mieć podane imie, rasę wybraną z predefiniowanej bazy oraz zdjęcie gatunku lub konkretnego osobnika
- ustawianie przypomnień czasowych (harmonogram karmienia, wizyt lekarskich itp.)

---

## **3. Minimalny Zestaw Funkcjonalności (MVP)**

### **Funkcjonalności podstawowe:**

1. **Zarządzanie użytkownikami - logowanie, rejestracja**
2. **Zarządzenie tworzonymi listami posiadanych zwierząt**
3. **Strona główna z ostatnio dodanymi zwierzakami**

---

## **4. Funkcjonalności poza zakresem MVP**

1. **Powiadomienia PUSH o dodaniu nowego zwierzaka**
2. **Sugestie AI na stronie głownej**
3. **Asystent wyboru nowego zwierzaka**
4. **Zarządzanie przypomnieniami czasowymi**

---

## **5. Kryteria sukcesu**

1. **75% zrealizowanych zadań**  
   Użytkownicy aplikacji będą tworzyć nowe listy na każdy tydzień, a 75% zaplanowanych Zwierzaków będzie faktycznie dodane do kolekcji.

2. **Wysoka satysfakcja użytkowników**  
   Aplikacja uzyska średnią ocenę 4.5/5 w ankietach satysfakcji użytkowników.

3. **Skalowalność**  
   Po osiągnięciu pełnej funkcjonalności aplikacja będzie mogła obsługiwać większą liczbę użytkowników bez spadku wydajności.

# 6. Wymagania funkcjonalne

## 6.1. Zarządzanie użytkownikami

### 6.1.1. Rejestracja użytkownika
- System umożliwia utworzenie nowego konta użytkownika.
- Użytkownik podaje:
  - e-mail
  - hasło
  - opcjonalnie imię
- System weryfikuje poprawność formatu e-maila.
- System sprawdza minimalne wymagania dotyczące hasła (min. 8 znaków).
- System wyświetla błędy walidacji.
- System zapisuje dane użytkownika w bazie.
- (Opcjonalnie) System wysyła e-mail potwierdzający rejestrację.

### 6.1.2. Logowanie użytkownika
- Użytkownik loguje się za pomocą e-maila i hasła.
- System weryfikuje dane logowania.
- System informuje o nieprawidłowych danych.
- Po poprawnym logowaniu system generuje sesję lub token.

### 6.1.3. Wylogowanie
- Użytkownik może zakończyć sesję.
- System unieważnia token użytkownika.

---

## 6.2. Zarządzanie listami posiadanych zwierząt

### 6.2.1. Tworzenie listy zwierząt
- Użytkownik może tworzyć nowe listy (np. "Moje pająki", "Gady").
- Użytkownik może nadać listom nazwy.
- System zapisuje listy i powiązuje je z użytkownikiem.

### 6.2.2. Edycja listy
- Użytkownik może zmieniać nazwę istniejącej listy.
- System aktualizuje dane listy.

### 6.2.3. Usuwanie listy
- Użytkownik może usunąć listę.
- System pyta o potwierdzenie przed usunięciem.
- System usuwa listę wraz ze wszystkimi przypisanymi zwierzętami.

---

## 6.3. Zarządzanie zwierzętami

### 6.3.1. Dodawanie zwierzęcia
- Użytkownik może dodać nowe zwierzę do wybranej listy.
- Przy dodawaniu zwierzęcia użytkownik może podać:
  - imię / nazwę zwierzaka,
  - gatunek wybrany z predefiniowanej bazy,
  - opcjonalnie zdjęcie (gatunku lub własne).
- System waliduje poprawność danych.
- System zapisuje zwierzę w bazie.

### 6.3.2. Edycja zwierzęcia
- Użytkownik może edytować istniejące dane zwierzęcia:
  - imię,
  - przypisany gatunek,
  - zdjęcie.
- System zapisuje zmiany.

### 6.3.3. Usuwanie zwierzęcia
- Użytkownik może usunąć dowolne zwierzę z listy.
- System wyświetla komunikat potwierdzający.
- System usuwa zwierzę z bazy.

---

## 6.4. Predefiniowana baza gatunków

### 6.4.1. Dostęp do listy gatunków
- System przechowuje listę gatunków z podziałem na grupy (np. pająki, jaszczurki, węże).
- Każdy gatunek zawiera:
  - nazwę,
  - opis,
  - zdjęcie poglądowe.

### 6.4.2. Wybór gatunku
- Użytkownik może przeglądać dostępne gatunki.
- Podczas dodawania zwierzęcia użytkownik wybiera gatunek z listy.

---

## 6.5. Strona główna

### 6.5.1. Ostatnio dodane zwierzęta
- Na stronie głównej system wyświetla listę ostatnio dodanych zwierząt (np. 5–10 pozycji).
- Każda pozycja zawiera:
  - zdjęcie,
  - imię,
  - gatunek,
  - datę dodania.

---

## 6.6. Funkcjonalności poza MVP

### 6.6.1. Powiadomienia PUSH
- System może informować użytkownika o dodaniu nowego zwierzęcia.

### 6.6.2. Sugestie AI
- System prezentuje rekomendacje zwierząt na podstawie posiadanych przez użytkownika danych.

### 6.6.3. Asystent wyboru zwierzaka
- Użytkownik może prowadzić dialog z asystentem AI.
- System rekomenduje gatunek na podstawie udzielonych odpowiedzi.

---

## 6.7. Zarządzanie przypomnieniami

### 6.7.1. Tworzenie przypomnień czasowych
- Użytkownik może ustawić przypomnienia związane z zwierzęciem.
- Przypomnienie zawiera:
  - tytuł,
  - opis,
  - datę i godzinę przypomnienia,
  - opcjonalnie powtarzalność (codziennie, co tydzień itp.),
  - opcjonalnie powiązanie z zwierzęciem.
- System zapisuje przypomnienia i wysyła powiadomienia w ustalonym czasie.

### 6.7.2. Edycja przypomnień
- Użytkownik może edytować istniejące przypomnienia.
- System aktualizuje dane przypomnienia.

### 6.7.3. Usuwanie przypomnień
- Użytkownik może usunąć przypomnienie.
- System pyta o potwierdzenie przed usunięciem.
- System usuwa przypomnienie z bazy.

### 6.7.4. Wyświetlanie harmonogramu
- Na dedykowanej stronie lub w aplikacji użytkownik może przeglądać wszystkie aktywne przypomnienia w formie harmonogramu.
- System wyświetla przypomnienia posortowane według daty i godziny.
```

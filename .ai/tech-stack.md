# **Tech Stack - Wersja z ASP.NET + .NET Identity + Entity Framework**

## **Frontend**

### **React**

React pozostaje główną biblioteką do budowy interfejsu użytkownika. Zapewnia dynamiczne komponenty, łatwą integrację z backendem oraz duże wsparcie społeczności.

* **Zalety**:

  * Popularność i bogaty ekosystem.
  * React Hooks oraz prostota tworzenia komponentów.
  * Idealny do nowoczesnych SPA.

### **Chakra UI**

Chakra UI to komponentowa biblioteka UI dla React, oferująca nowoczesne, dostępne i łatwe w użyciu komponenty oraz prosty system stylowania oparty na propsach.

* **Zalety**:

  * Bogaty zestaw gotowych komponentów.
  * Wbudowane wsparcie dla themingu i trybu ciemnego.
  * Bardzo dobra integracja z TypeScript.
  * Łatwe tworzenie responsywnego designu.

---

## **Backend**

### **ASP.NET Core Web API**

ASP.NET Core stanowi fundament backendu aplikacji. Jest to nowoczesny, szybki i skalowalny framework, który świetnie integruje się z ekosystemem Microsoft i chmurą Azure.

* **Zalety**:

  * Bardzo wysoka wydajność.
  * Wbudowane wsparcie dla dependency injection.
  * Łatwa integracja z systemami logowania i Entity Framework.
  * Doskonała integracja z Azure.

### **System logowania i autoryzacji – .NET Identity**

.NET Identity to najnowszy system zarządzania kontami i autoryzacją w ekosystemie .NET. Zapewnia bezpieczne zarządzanie użytkownikami, rolami, tokenami oraz integrację z OAuth i providerami zewnętrznymi.

* **Zalety**:

  * Gotowe modele i logika rejestracji/logowania.
  * Wsparcie dla MFA, resetowania hasła, e-mail confirmations.
  * Łatwe rozszerzanie modelu użytkownika.

### **Entity Framework Core (EF Core)**

Entity Framework Core będzie używany jako ORM do komunikacji z bazą danych.

* **Zalety**:

  * Wsparcie dla migracji.
  * LINQ.
  * Szybki rozwój aplikacji bez potrzeby pisania SQL.

---

## **Baza danych**

### **Azure SQL Server

Aplikacja będzie wykorzystywać **SQL Server** jako główną bazę danych, w pełni kompatybilną z Entity Framework Core i doskonale integrującą się z Azure.

---

## **AI w MVP**

### **OpenAI GPT‑3 / GPT‑4 API**

API OpenAI jest wykorzystywane do generowania tygodniowych planów, analizowania danych użytkownika i tworzenia sugestii.

* **Zalety**:

  * Brak potrzeby trenowania własnych modeli.
  * Bardzo wysoka jakość generowanych treści.

---

## **API**

### **REST API (ASP.NET Core)**

Backend udostępnia REST API, które pozwala frontendowi komunikować się z logiką aplikacji.

* **Zalety**:

  * Naturalna integracja z ASP.NET.
  * Łatwa serializacja JSON.

---

## **Hosting i Infrastruktura**

### **Azure**

Azure będzie platformą do hostowania frontendu, backendu, bazy danych oraz komponentów storage (np. Azure Blob Storage).

* **Zalety**:

  * Świetne wsparcie dla aplikacji ASP.NET.
  * Azure App Service, Azure SQL, Key Vault, Application Insights.

---

## **Repozytorium i CI/CD**

### **GitHub + GitHub Actions**

GitHub pozostaje systemem kontroli wersji, a GitHub Actions obsługuje automatyzację.

* **Zalety**:

  * Wsparcie dla .NET build pipelines.
  * Integracja z Azure do automatycznego deployu.

---

## **Testowanie i Monitoring**

### **xUnit / NUnit (Backend)**

Popularne frameworki testowe dla .NET.

### **Jest (Frontend)**

Testy jednostkowe React.

### **Azure Application Insights**

Monitoring wydajności, logów i błędów.

---

## **Podsumowanie nowego stacku technologicznego**

* **Frontend**: React, Chakra UI
* **Backend**: ASP.NET Core Web API
* **Autoryzacja**: .NET Identity (najnowsza wersja)
* **ORM**: Entity Framework Core
* **Baza danych**: SQL Server (Azure SQL Server)
* **Przechowywanie plików**: Azure Blob Storage
* **AI**: OpenAI GPT-3/4 API
* **API**: REST API
* **Hosting**: Azure
* **Repozytorium i CI/CD**: GitHub + GitHub Actions
* **Testy**: NUnit (backend), Jest (frontend)
* **Monitoring**: Azure Application Insights

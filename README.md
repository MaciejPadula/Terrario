# Terrario - System Zarządzania Zwierzętami Terrarystycznymi

Aplikacja webowa do zarządzania kolekcją zwierząt terrarystycznych, zbudowana w architekturze Vertical Slice.

## 📋 Spis treści

- [Tech Stack](#tech-stack)
- [Struktura Projektu](#struktura-projektu)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [Architektura](#architektura)

## 🛠 Tech Stack

### Backend
- **ASP.NET Core 10** - Framework webowy
- **ASP.NET Identity** - System autentykacji i autoryzacji
- **Entity Framework Core** - ORM
- **SQL Server** - Baza danych
- **JWT Bearer Authentication** - Tokeny JWT do autoryzacji

### Frontend
- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Chakra UI v3** - Biblioteka komponentów UI
- **React Router** - Routing
- **Vite** - Build tool

## 📁 Struktura Projektu

### Backend - Vertical Slice Architecture

```
Terrario.Server/
├── Features/                    # Funkcjonalności (Vertical Slices)
│   └── Auth/
│       ├── Login/              # Slice logowania
│       │   ├── LoginModels.cs
│       │   ├── LoginHandler.cs
│       │   └── LoginEndpoint.cs
│       ├── Register/           # Slice rejestracji
│       │   ├── RegisterModels.cs
│       │   ├── RegisterHandler.cs
│       │   └── RegisterEndpoint.cs
│       └── Shared/             # Współdzielone komponenty Auth
│           └── ApplicationUser.cs
├── Database/
│   ├── ApplicationDbContext.cs
│   └── Scripts/                # Skrypty SQL
│       ├── 000_Create_Database.sql
│       └── 001_Create_Identity_Tables.sql
├── Shared/                     # Wspólne serwisy
│   └── JwtTokenService.cs
└── Program.cs
```

### Frontend - Vertical Slice Architecture

```
terrario.client/
├── src/
│   ├── features/               # Funkcjonalności (Vertical Slices)
│   │   └── auth/
│   │       ├── login/         # Slice logowania
│   │       │   └── LoginPage.tsx
│   │       ├── register/      # Slice rejestracji
│   │       │   └── RegisterPage.tsx
│   │       └── shared/        # Współdzielone typy Auth
│   │           └── types.ts
│   ├── shared/                # Wspólne komponenty
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   └── toaster.ts
│   ├── App.tsx
│   └── main.tsx
```

## 🚀 Instalacja

### Wymagania wstępne

- **.NET 10 SDK**
- **Node.js 22+**
- **SQL Server** (LocalDB, Express lub pełna wersja)

### Kroki instalacji

1. **Klonowanie repozytorium**
```powershell
git clone <repository-url>
cd Terrario
```

2. **Instalacja zależności backendu**
```powershell
cd src/Terrario.Server
dotnet restore
```

3. **Instalacja zależności frontendu**
```powershell
cd src/terrario.client
npm install
```

## ⚙️ Konfiguracja

### Backend

1. **Konfiguracja bazy danych**

Utwórz plik `appsettings.json` (jeśli nie istnieje):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Terrario;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG",
    "Issuer": "Terrario.Server",
    "Audience": "Terrario.Client",
    "ExpirationHours": "24"
  }
}
```

2. **Uruchomienie skryptów SQL**

```powershell
cd src/Terrario.Server/Database/Scripts

# Opcja 1: SQL Server Management Studio
# Otwórz i wykonaj każdy skrypt po kolei

# Opcja 2: sqlcmd
sqlcmd -S localhost -i "000_Create_Database.sql"
sqlcmd -S localhost -i "001_Create_Identity_Tables.sql"
```

### Frontend

1. **Konfiguracja zmiennych środowiskowych**

Utwórz plik `.env.local` na podstawie `.env.example`:

```env
VITE_API_URL=https://localhost:7163
```

## 🏃 Uruchomienie

### Uruchomienie backendu

```powershell
cd src/Terrario.Server
dotnet run
```

Backend będzie dostępny pod adresem: `https://localhost:7163`

### Uruchomienie frontendu

```powershell
cd src/terrario.client
npm run dev
```

Frontend będzie dostępny pod adresem: `http://localhost:5173`

## 🏛 Architektura

### Vertical Slice Architecture

Projekt wykorzystuje **Vertical Slice Architecture** zamiast tradycyjnej architektury warstwowej:

#### Zalety:
- ✅ **Wysoka kohezja** - Cały kod dotyczący jednej funkcjonalności w jednym miejscu
- ✅ **Łatwe dodawanie nowych funkcji** - Nowe slice'y nie wpływają na istniejące
- ✅ **Łatwiejsze zrozumienie** - Kod zorganizowany wokół przypadków użycia
- ✅ **Mniejsze konflikty w kodzie** - Zespoły mogą pracować równolegle nad różnymi slice'ami

#### Backend Slice (przykład Login):

```
Login/
├── LoginModels.cs       # Request/Response DTOs
├── LoginHandler.cs      # Logika biznesowa
└── LoginEndpoint.cs     # Endpoint API
```

Wszystko co potrzebne do logowania jest w jednym folderze!

#### Frontend Slice (przykład Login):

```
login/
└── LoginPage.tsx        # Komponent, logika, stan
```

## 🔐 Bezpieczeństwo

- Hasła są hashowane przy użyciu ASP.NET Identity
- JWT tokeny do autoryzacji z konfigurow alnym czasem wygaśnięcia
- HTTPS wymuszane na produkcji
- CORS skonfigurowany dla bezpiecznej komunikacji frontend-backend

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie użytkownika

## 🧪 Testowanie

### Backend
```powershell
cd src/Terrario.Server
dotnet test
```

### Frontend
```powershell
cd src/terrario.client
npm test
```

## 📦 Deployment

### Backend (Azure App Service)
```powershell
dotnet publish -c Release
# Deploy do Azure App Service
```

### Frontend (Azure Static Web Apps)
```powershell
npm run build
# Deploy dist/ do Azure Static Web Apps
```

## 🤝 Contributing

1. Fork projektu
2. Utwórz feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest licencjonowany na zasadach MIT License.

## 👥 Autorzy

- Maciej Padula - Initial work

## 🙏 Podziękowania

- ASP.NET Core Team
- React Team
- Chakra UI Team

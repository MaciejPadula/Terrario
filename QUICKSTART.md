# Szybki Start - Terrario

## 🚀 Uruchomienie aplikacji

### 1. Przygotowanie bazy danych

Otwórz SQL Server Management Studio lub Azure Data Studio i wykonaj skrypty SQL po kolei:

```sql
-- 1. Utwórz bazę danych
-- Plik: src/Terrario.Server/Database/Scripts/000_Create_Database.sql

-- 2. Utwórz tabele Identity
-- Plik: src/Terrario.Server/Database/Scripts/001_Create_Identity_Tables.sql
```

Lub użyj `sqlcmd`:
```powershell
cd src/Terrario.Server/Database/Scripts
sqlcmd -S localhost -i "000_Create_Database.sql"
sqlcmd -S localhost -i "001_Create_Identity_Tables.sql"
```

### 2. Konfiguracja Backend

**Ważne:** Upewnij się, że plik `appsettings.json` zawiera poprawne ustawienia (jeśli plik jest ignorowany przez git, utwórz go ręcznie):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Terrario;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKey_AtLeast32Characters_Long_ChangeMe!",
    "Issuer": "Terrario.Server",
    "Audience": "Terrario.Client",
    "ExpirationHours": "24"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 3. Konfiguracja Frontend

Plik `.env.local` został już utworzony z domyślnymi ustawieniami:
```env
VITE_API_URL=http://localhost:5252
```

**Uwaga:** Port 5252 to domyślny port HTTP ASP.NET Core. Jeśli Twój backend działa na innym porcie, zaktualizuj tę wartość.

### 4. Uruchomienie

#### Terminal 1 - Backend
```powershell
cd src/Terrario.Server
dotnet run
```

Backend powinien wyświetlić:
```
Now listening on: http://localhost:5252
```

#### Terminal 2 - Frontend
```powershell
cd src/terrario.client
npm run dev
```

Frontend powinien być dostępny pod adresem: **http://localhost:5173**

## 🧪 Testowanie

1. Otwórz przeglądarkę i przejdź do `http://localhost:5173`
2. Powinieneś zostać przekierowany na `/login`
3. Kliknij "Zarejestruj się"
4. Wypełnij formularz rejestracji:
   - Email: `test@example.com`
   - Hasło: `Test1234` (min. 8 znaków)
   - Potwierdź hasło: `Test1234`
   - Imię: `Test` (opcjonalne)
5. Po pomyślnej rejestracji zostaniesz przekierowany na stronę główną
6. Możesz się wylogować i zalogować ponownie

## ⚠️ Rozwiązywanie problemów

### Błąd: `ERR_CONNECTION_REFUSED`
- ✅ **Rozwiązanie:** Upewnij się, że backend jest uruchomiony (`dotnet run`)
- ✅ **Rozwiązanie:** Sprawdź czy port w `.env.local` zgadza się z portem backendu

### Błąd: CORS
- ✅ **Rozwiązanie:** Backend jest już skonfigurowany do akceptowania połączeń z `localhost:5173` i `localhost:5174`

### Błąd: Nie można połączyć z bazą danych
- ✅ **Rozwiązanie:** Sprawdź czy SQL Server działa
- ✅ **Rozwiązanie:** Zweryfikuj connection string w `appsettings.json`
- ✅ **Rozwiązanie:** Upewnij się że baza `Terrario` istnieje

### Błąd: JWT Invalid
- ✅ **Rozwiązanie:** Sprawdź czy `JwtSettings:SecretKey` ma co najmniej 32 znaki
- ✅ **Rozwiązanie:** Wyczyść localStorage w przeglądarce (F12 → Application → Local Storage → Clear)

## 📝 Przydatne komendy

```powershell
# Backend - Rebuild
cd src/Terrario.Server
dotnet clean
dotnet build

# Frontend - Rebuild
cd src/terrario.client
Remove-Item node_modules -Recurse -Force
npm install

# Backend - Sprawdź port
cd src/Terrario.Server
dotnet run
# Szukaj: "Now listening on: http://localhost:XXXX"
```

## 🎯 Domyślne porty

- **Backend API:** `http://localhost:5252`
- **Frontend:** `http://localhost:5173`
- **SQL Server:** `localhost,1433` (domyślnie)

## 📚 Dokumentacja API

Po uruchomieniu backendu, dokumentacja OpenAPI jest dostępna pod:
- Swagger UI: `http://localhost:5252/swagger` (jeśli dodasz SwaggerUI)
- OpenAPI JSON: `http://localhost:5252/openapi/v1.json` (w trybie Development)

## ✨ Pierwsze kroki po uruchomieniu

1. **Zarejestruj konto testowe**
2. **Zaloguj się**
3. **Zobacz stronę główną** z informacjami o zalogowanym użytkowniku
4. **Wyloguj się i zaloguj ponownie** aby przetestować zachowanie sesji

---

**Powodzenia!** 🦎🐍🕷️

# Database Migration Scripts

Ten folder zawiera skrypty SQL do tworzenia i aktualizacji struktury bazy danych dla aplikacji Terrario.

## Kolejność wykonywania skryptów

Skrypty powinny być wykonywane w następującej kolejności:

1. **000_Create_Database.sql** - Tworzy bazę danych Terrario
2. **001_Create_Identity_Tables.sql** - Tworzy wszystkie tabele potrzebne dla ASP.NET Identity

## Jak uruchomić skrypty

### Opcja 1: SQL Server Management Studio (SSMS)
1. Otwórz SSMS i połącz się z serwerem SQL Server
2. Otwórz każdy skrypt po kolei (File > Open > File)
3. Upewnij się, że jesteś połączony z odpowiednim serwerem
4. Naciśnij F5 lub kliknij "Execute"

### Opcja 2: sqlcmd (Command Line)
```powershell
# Uruchom każdy skrypt po kolei
sqlcmd -S localhost -i "000_Create_Database.sql"
sqlcmd -S localhost -i "001_Create_Identity_Tables.sql"
```

### Opcja 3: Azure Data Studio
1. Otwórz Azure Data Studio
2. Połącz się z serwerem SQL Server
3. Otwórz każdy skrypt (File > Open File)
4. Kliknij "Run" lub naciśnij F5

## Connection String

Domyślny connection string w `appsettings.json` powinien wyglądać tak:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Terrario;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Dla Azure SQL:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:{your-server}.database.windows.net,1433;Initial Catalog=Terrario;Persist Security Info=False;User ID={username};Password={password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

## Struktura tabel

### Users (AspNetUsers)
- Główna tabela użytkowników
- Zawiera podstawowe pola Identity + customowe pola (FirstName, CreatedAt, UpdatedAt)

### AspNetRoles
- Tabela ról użytkowników

### AspNetUserRoles
- Tabela łącząca użytkowników z rolami

### AspNetUserClaims
- Claims przypisane do użytkowników

### AspNetUserLogins
- Zewnętrzne loginy (Google, Facebook, etc.)

### AspNetUserTokens
- Tokeny użytkowników (reset hasła, email confirmation, etc.)

### AspNetRoleClaims
- Claims przypisane do ról

## Weryfikacja

Po wykonaniu skryptów możesz zweryfikować, czy wszystko zostało utworzone poprawnie:

```sql
USE Terrario;
GO

-- Sprawdź wszystkie tabele
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Sprawdź strukturę tabeli Users
EXEC sp_help 'Users';
```

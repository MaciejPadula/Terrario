# Terrario Azure Infrastructure

Infrastructure as Code using Terraform for deploying Terrario application to Azure.

## Architecture

- **App Service (Linux)** - ASP.NET Core 10.0 Backend API + React Frontend (wwwroot)
- **Azure SQL Database** - SQL Server Database
- **Storage Account** - Azure Blob Storage for animal images
- **Application Insights** - Monitoring and logging
- **Log Analytics Workspace** - Centralized logging

> **Note:** Frontend React app is built and served from ASP.NET Core's `wwwroot` folder.

## Prerequisites

1. **Azure CLI** - [Install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Terraform** - [Install](https://www.terraform.io/downloads)
3. **Azure Subscription** with appropriate permissions

## Setup

### 1. Login to Azure

```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### 2. Configure Terraform Variables

Copy the example file and edit values:

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set:
- `sql_admin_password` - Strong password for SQL Server (min 12 chars, upper/lower/digit/special)
- `jwt_secret_key` - Secret key for JWT tokens (min 32 chars)
- `environment` - Environment name (dev/staging/prod)

### 3. Initialize Terraform

```bash
terraform init
```

### 4. Plan Infrastructure

```bash
terraform plan
```

Review the planned changes.

### 5. Apply Infrastructure

```bash
terraform apply
```

Type `yes` to confirm.

## Deployment

### Full Application (Frontend + Backend)

The ASP.NET Core backend serves the React frontend from `wwwroot` folder.

1. Build the frontend:

```bash
cd src/terrario.client
npm install
npm run build
```

2. Copy frontend build to backend wwwroot:

```bash
# PowerShell
Remove-Item -Recurse -Force ..\Terrario.Server\wwwroot\* -ErrorAction SilentlyContinue
Copy-Item -Recurse .\dist\* ..\Terrario.Server\wwwroot\

# Bash
rm -rf ../Terrario.Server/wwwroot/*
cp -r ./dist/* ../Terrario.Server/wwwroot/
```

3. Publish the backend:

```bash
cd ../Terrario.Server
dotnet publish -c Release -o ./publish
```

4. Create zip for deployment:

```bash
# PowerShell
Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip -Force

# Bash
cd publish && zip -r ../publish.zip . && cd ..
```

5. Deploy to App Service:

```bash
az webapp deployment source config-zip \
  --resource-group terrario-dev-rg \
  --name terrario-dev-app \
  --src ./publish.zip
```

Or use GitHub Actions (recommended - see below).

### Database Migrations

After infrastructure is created, run SQL migrations:

1. Get connection string from outputs:

```bash
terraform output sql_server_fqdn
```

2. Connect with Azure Data Studio or SSMS

3. Run migration scripts in order:
   - `Database/Scripts/001_Create_Identity_Tables.sql`
   - `Database/Scripts/002_Create_AnimalLists_Table.sql`
   - `Database/Scripts/003_Create_Species_Table.sql`
   - `Database/Scripts/004_Create_Animals_Table.sql`

## Outputs

After successful deployment:

```bash
# Get all outputs
terraform output

# Get application URL
terraform output app_url
```

## Configuration

### Environment Variables (Backend)

Set in App Service Configuration or `main.tf`:
- `JwtSettings__SecretKey` - JWT secret key
- `JwtSettings__Issuer` - JWT issuer
- `JwtSettings__Audience` - JWT audience
- `ConnectionStrings__DefaultConnection` - SQL connection string

### Frontend Environment Variables

Update `terrario.client/.env.production`:

```env
VITE_API_URL=https://terrario-dev-api.azurewebsites.net
```

## Cost Estimation

**Development (Basic tier):**

- App Service Plan (B1): ~$13/month
- SQL Database (Basic): ~$5/month
- Application Insights: ~$0-5/month (depending on usage)

**Total: ~$18-23/month**

**Production (Standard tier):**

- App Service Plan (P1V2): ~$73/month
- SQL Database (S0): ~$15/month
- Application Insights: ~$10-30/month

**Total: ~$98-118/month**

## Scaling

To upgrade tiers, edit `main.tf`:

### App Service
```hcl
sku_name = "P1V2"  # Production tier
```

### SQL Database
```hcl
sku_name = "S0"  # Standard tier (~$15/month)
# Or for higher performance:
sku_name = "S1"  # ~$30/month
sku_name = "S2"  # ~$75/month
```

## Security

1. **Secrets Management**: Use Azure Key Vault for production
2. **Managed Identity**: Backend uses System Assigned Identity
3. **HTTPS Only**: Enforced on all endpoints
4. **SQL Firewall**: Only Azure services allowed by default
5. **CORS**: Configured to allow only frontend domain

## Monitoring

Access Application Insights:
```bash
az monitor app-insights component show \
  --app terrario-dev-ai \
  --resource-group terrario-dev-rg
```

## Cleanup

To destroy all infrastructure:

```bash
terraform destroy
```

## Troubleshooting

### SQL Connection Issues

- Check firewall rules
- Verify connection string
- Ensure App Service has network access

### App Not Starting

- Check App Service logs: `az webapp log tail --name terrario-dev-app --resource-group terrario-dev-rg`
- Verify environment variables
- Check Application Insights for errors
- Ensure frontend files are in wwwroot folder

## GitHub Actions CI/CD

### Setup Instructions

1. **Get publish profile from Azure:**

```bash
az webapp deployment list-publishing-profiles \
  --resource-group terrario-dev-rg \
  --name terrario-dev-app \
  --xml
```

2. **Add secrets to GitHub repository:**

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | Value | How to get |
|-------------|-------|------------|
| `AZURE_WEBAPP_NAME` | `terrario-dev-app` | Your App Service name from Terraform output |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | `<publishData>...</publishData>` | Output from step 1 (full XML) |

3. **Workflow file is ready:**

The workflow file `.github/workflows/deploy.yml` is already created and will:
- ✅ Build frontend (React + Vite)
- ✅ Copy frontend to backend wwwroot
- ✅ Build and publish backend (.NET 10)
- ✅ Deploy to Azure App Service
- ✅ Trigger on push to `main` branch or manually

4. **Test the workflow:**

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

Monitor the deployment in GitHub: **Actions** tab

### Manual Deployment Trigger

You can also trigger deployment manually from GitHub:
1. Go to **Actions** tab
2. Select **Deploy to Azure** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Troubleshooting Deployment

**Build fails:**
- Check Node.js version matches project requirements
- Verify all npm dependencies are in package.json
- Check .NET version (8.0.x)

**Deployment fails:**
- Verify `AZURE_WEBAPP_PUBLISH_PROFILE` secret is correctly set
- Check App Service name matches Terraform output
- Ensure publish profile is valid (not expired)

**App doesn't start after deployment:**
- Check App Service logs: `az webapp log tail --name terrario-dev-app --resource-group terrario-dev-rg`
- Verify environment variables in Azure Portal
- Check Application Insights for errors

## Support

For issues or questions:
- GitHub Issues: [Your Repo URL]
- Documentation: [Your Docs URL]

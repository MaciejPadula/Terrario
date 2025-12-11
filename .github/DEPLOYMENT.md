# GitHub Actions Deployment Guide

## Quick Setup (5 minutes)

### 1. Deploy Infrastructure with Terraform

```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

Save the outputs:
- `app_url` - Your application URL
- `app_name` - App Service name (e.g., terrario-dev-app)

### 2. Configure GitHub Secrets

#### Get Azure Publish Profile

```bash
# Replace with your values from Terraform output
az webapp deployment list-publishing-profiles \
  --resource-group terrario-dev-rg \
  --name terrario-dev-app \
  --xml
```

#### Add Secrets to GitHub

Go to your GitHub repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AZURE_WEBAPP_NAME` | `terrario-dev-app` (from Terraform output) |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Full XML from publish profile command |

### 3. Update Frontend Production URL

Edit `src/terrario.client/.env.production`:

```env
VITE_API_URL=https://terrario-dev-app.azurewebsites.net
```

Replace with your `app_url` from Terraform output.

### 4. Run SQL Migrations

Connect to your Azure SQL Database and run migrations in order:
1. `Database/Scripts/001_Create_Identity_Tables.sql`
2. `Database/Scripts/002_Create_AnimalLists_Table.sql`
3. `Database/Scripts/003_Create_Species_Table.sql`
4. `Database/Scripts/004_Create_Animals_Table.sql`

### 5. Deploy!

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

Watch deployment progress in GitHub: **Actions** tab

### 6. Test Your Application

Open your app: `https://terrario-dev-app.azurewebsites.net`

## Workflow Features

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

✅ **Builds frontend** (React + Vite + TypeScript)
✅ **Copies frontend to backend** (wwwroot folder)
✅ **Builds backend** (.NET 10)
✅ **Publishes backend** (Release configuration)
✅ **Deploys to Azure** App Service

**Triggers:**
- 🔄 Automatic: On push to `main` branch
- 🎯 Manual: Actions tab → Run workflow

## Troubleshooting

### Build Fails

**Frontend build error:**
- Check `package.json` versions
- Verify Node.js version (20.x)
- Run locally: `cd src/terrario.client && npm ci && npm run build`

**Backend build error:**
- Check .NET version (10.0.x)
- Run locally: `cd src/Terrario.Server && dotnet build`

### Deployment Fails

**Invalid publish profile:**
```bash
# Generate new profile
az webapp deployment list-publishing-profiles \
  --resource-group terrario-dev-rg \
  --name terrario-dev-app \
  --xml
```
Update `AZURE_WEBAPP_PUBLISH_PROFILE` secret.

**Wrong app name:**
- Verify `AZURE_WEBAPP_NAME` matches Terraform output
- Check Azure Portal: App Services → your app name

### App Doesn't Start

**Check logs:**
```bash
az webapp log tail \
  --name terrario-dev-app \
  --resource-group terrario-dev-rg
```

**Common issues:**
- Missing environment variables → Check App Service Configuration
- Database connection failed → Verify connection string and firewall
- Frontend 404 → Ensure wwwroot has index.html

## Manual Deployment (without GitHub Actions)

If you prefer manual deployment:

```bash
# 1. Build frontend
cd src/terrario.client
npm ci
npm run build

# 2. Copy to backend
cd ..
rm -rf Terrario.Server/wwwroot/*
cp -r terrario.client/dist/* Terrario.Server/wwwroot/

# 3. Publish backend
cd Terrario.Server
dotnet publish -c Release -o ./publish

# 4. Deploy to Azure
az webapp deployment source config-zip \
  --resource-group terrario-dev-rg \
  --name terrario-dev-app \
  --src ./publish.zip
```

## Cost Monitoring

After deployment, monitor costs in Azure Portal:
- **Cost Management + Billing** → **Cost analysis**
- Expected: ~$18-23/month (development)

## Next Steps

- [ ] Run SQL migrations
- [ ] Test authentication (register/login)
- [ ] Create animal lists
- [ ] Add animals with species
- [ ] Check Application Insights for telemetry
- [ ] Setup alerts for errors in Azure Monitor

## Support

For issues:
- Check GitHub Actions logs
- Review Azure App Service logs
- Check Application Insights errors

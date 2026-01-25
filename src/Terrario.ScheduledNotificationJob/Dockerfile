# Use the official .NET runtime image
FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
WORKDIR /app

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Terrario.ScheduledNotificationJob.csproj", "."]
RUN dotnet restore "Terrario.ScheduledNotificationJob.csproj"
COPY . .
RUN dotnet build "Terrario.ScheduledNotificationJob.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Terrario.ScheduledNotificationJob.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Terrario.ScheduledNotificationJob.dll"]
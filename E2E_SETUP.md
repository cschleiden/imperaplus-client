# Local E2E Testing Setup Guide

This guide walks you through setting up a complete local development environment for end-to-end testing of ImperaPlus, including both the backend and frontend applications.

## Overview

ImperaPlus consists of two main components:
- **Backend**: [cschleiden/imperaplus-backend](https://github.com/cschleiden/imperaplus-backend) - .NET Core API
- **Frontend**: [cschleiden/imperaplus-client](https://github.com/cschleiden/imperaplus-client) - Next.js application (this repository)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **.NET SDK**: v6.0 or higher (for backend)
- **Git**: Latest version
- **Database**: SQL Server or PostgreSQL (depending on backend configuration)

Optional but recommended:
- **Docker**: For running databases in containers
- **Visual Studio Code**: With recommended extensions

## Part 1: Backend Setup

### 1.1 Clone the Backend Repository

```bash
# Clone the backend repository
git clone https://github.com/cschleiden/imperaplus-backend.git
cd imperaplus-backend
```

### 1.2 Database Setup

The backend requires a database. You can either:

**Option A: Use Docker (Recommended)**
```bash
# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest
```

**Option B: Use Local Database**
Install SQL Server or PostgreSQL locally and create a database for the application.

### 1.3 Configure Backend

1. Create a configuration file (typically `appsettings.Development.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=ImperaPlus;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:8080"]
  }
}
```

2. Adjust the connection string based on your database setup.

### 1.4 Install Backend Dependencies

```bash
# Restore NuGet packages
dotnet restore

# Apply database migrations (if applicable)
dotnet ef database update
```

### 1.5 Run the Backend

```bash
# Run the backend API
dotnet run

# Or with hot reload during development
dotnet watch run
```

The backend should now be running on `https://localhost:5001` (or the port specified in your configuration).

**Note the backend URL** - you'll need it for frontend configuration.

## Part 2: Frontend Setup

### 2.1 Clone the Frontend Repository (if not already done)

```bash
# Clone this repository
git clone https://github.com/cschleiden/imperaplus-client.git
cd imperaplus-client
```

### 2.2 Install Frontend Dependencies

```bash
# Install npm packages
npm install
```

This may take a few minutes as it installs all required dependencies.

### 2.3 Configure Frontend

The frontend needs to know where the backend API is located. The configuration is handled in `src/configuration.ts`.

**For local development**, the default configuration points to production. To override this for local testing:

**Option A: Modify configuration.ts temporarily**

Edit `src/configuration.ts` and change the default values:

```typescript
export const baseUri = getToken("baseUri", "http://localhost:5000");
```

**Option B: Use environment-based configuration**

The application supports runtime configuration through the `BASE_URI` environment variable when using Docker. For local development, the configuration tokens in `src/configuration.ts` are used.

### 2.4 Handle SSL Certificate Issues

The backend may use a self-signed SSL certificate in development. The npm dev script already includes `NODE_TLS_REJECT_UNAUTHORIZED=0` to handle this, but be aware this should only be used in development.

## Part 3: Running the Complete Stack

### 3.1 Start Both Services

**Terminal 1 - Backend:**
```bash
cd imperaplus-backend
dotnet watch run
```

Wait for the backend to start completely. You should see output indicating it's listening on specific ports.

**Terminal 2 - Frontend:**
```bash
cd imperaplus-client
npm run dev
```

### 3.2 Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:8080
- **Backend API**: https://localhost:5001 (or your configured port)
- **API Documentation**: https://localhost:5001/swagger (if enabled)

## Part 4: Verification and Testing

### 4.1 Verify the Connection

1. Open the browser developer console (F12)
2. Navigate through the application
3. Check the Network tab for API calls to your local backend
4. Verify requests are going to `http://localhost:5000` or your configured backend URL

### 4.2 Test Key Flows

Try the following to ensure everything is working:

1. **User Registration**: Create a new account
2. **Login**: Sign in with the created account
3. **API Calls**: Perform actions that trigger API requests
4. **SignalR**: Test real-time features (chat, notifications) if applicable
5. **Game Creation**: Create and join games (if this is the main feature)

### 4.3 Monitor Logs

Watch both terminal windows for:
- API request logs in the backend
- Console logs in the frontend
- Any error messages or exceptions

## Part 5: Docker-based Setup (Alternative)

If you prefer using Docker for the entire stack:

### 5.1 Backend in Docker

Refer to the imperaplus-backend repository for Docker setup instructions.

### 5.2 Frontend in Docker

Build and run the frontend container:

```bash
# Build the Docker image
docker build -t impera-frontend:dev .

# Run with environment variables
docker run -p 8080:3000 \
  -e BASE_URI=http://localhost:5000 \
  impera-frontend:dev
```

### 5.3 Docker Compose

Create a `docker-compose.yml` file in a parent directory containing both repositories:

```yaml
version: "3.8"

services:
  backend:
    build: ./imperaplus-backend
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=db;Database=ImperaPlus;User=sa;Password=YourStrong@Passw0rd
    depends_on:
      - db

  frontend:
    build: ./imperaplus-client
    ports:
      - "8080:3000"
    environment:
      - BASE_URI=http://localhost:5000
    depends_on:
      - backend

  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
    ports:
      - "1433:1433"
```

Run with:
```bash
docker-compose up
```

## Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms**: API calls fail with CORS errors or connection refused

**Solutions**:
1. Verify backend is running and listening on the expected port
2. Check `src/configuration.ts` has the correct backend URL
3. Ensure backend CORS configuration allows requests from `http://localhost:8080`
4. Check firewall settings aren't blocking the connection

### Issue: SSL/TLS certificate errors

**Symptoms**: Certificate validation errors when making API calls

**Solutions**:
1. The dev script includes `NODE_TLS_REJECT_UNAUTHORIZED=0` for development
2. For production-like testing, configure proper SSL certificates in the backend
3. Import the backend's development certificate into your system's trusted certificates

### Issue: Database connection fails

**Symptoms**: Backend crashes or returns 500 errors on startup

**Solutions**:
1. Verify the database server is running
2. Check the connection string in backend configuration
3. Ensure the database exists and migrations have been applied
4. Check database server logs for authentication issues

### Issue: SignalR connections fail

**Symptoms**: Real-time features don't work, SignalR connection errors in console

**Solutions**:
1. Verify the backend SignalR endpoint is accessible
2. Check that the frontend `src/clients/signalrFactory.ts` is using the correct base URL
3. Ensure WebSocket connections are not blocked by proxies or firewalls
4. Check browser console for specific SignalR error messages

### Issue: Auto-generated API clients are outdated

**Symptoms**: Type errors or missing endpoints in TypeScript

**Solutions**:
1. The API clients in `src/external/` are generated from the backend OpenAPI spec
2. Regenerate clients using NSwagStudio (settings file in backend repository)
3. Note: The `token` endpoint generation has known issues - manually revert changes to that endpoint after regeneration

### Issue: Port already in use

**Symptoms**: "Port 8080 already in use" or similar error

**Solutions**:
```bash
# Find and kill the process using the port
# On Linux/Mac:
lsof -ti:8080 | xargs kill -9

# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: npm install fails

**Symptoms**: Dependency installation errors

**Solutions**:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`, then run `npm install` again
3. Ensure you're using a compatible Node.js version (v18.x recommended)

## Development Tips

### Hot Reload

Both the frontend and backend support hot reload:
- **Frontend**: Changes to files in `src/` trigger automatic recompilation
- **Backend**: Use `dotnet watch run` for automatic restart on code changes

### API Documentation

If the backend has Swagger enabled, access it at:
```
https://localhost:5001/swagger
```

This provides interactive API documentation and testing capabilities.

### Redux DevTools

The frontend includes Redux DevTools integration. Install the browser extension for debugging:
- Chrome: [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: [Redux DevTools Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### Debugging

**Frontend:**
- Use browser DevTools (F12)
- Add breakpoints in Sources tab
- Use `console.log()` or `debugger` statements

**Backend:**
- Attach a debugger from Visual Studio or VS Code
- Set breakpoints in your IDE
- Check console output and logs

### Client Regeneration

When backend API changes:
1. Get the OpenAPI/Swagger spec from the backend
2. Use NSwagStudio with the settings file from the backend repository
3. Regenerate the clients in `src/external/`
4. Review and manually fix the `token` endpoint if needed
5. Test the changes thoroughly

## Additional Resources

- **Backend Repository**: https://github.com/cschleiden/imperaplus-backend
- **Production Instance**: https://www.imperaonline.de
- **Dev Instance**: https://dev.imperaonline.de
- **API Documentation**: https://www.imperaonline.de/api/swagger/

## Contributing

Once you have your local environment set up:
1. Make your changes
2. Test locally using this setup
3. Create a pull request
4. Changes merged to `master` are auto-deployed to the dev environment
5. After validation, changes are promoted to production

## Notes

- The frontend uses Next.js 12 with React 17 and Redux Toolkit
- API clients are auto-generated using NSwag from the backend OpenAPI specification
- The application uses SignalR for real-time features (chat, notifications, game updates)
- Bootstrap 3 is used for styling (via react-bootstrap)
- The frontend build process handles internationalization (i18n)

## Security Considerations

When running locally for development:
- Use `NODE_TLS_REJECT_UNAUTHORIZED=0` only in development, never in production
- Don't commit sensitive configuration (passwords, connection strings) to version control
- Use environment variables for sensitive data
- Keep your local databases secure and isolated from production data

---

For questions or issues not covered in this guide, please:
1. Check existing GitHub issues in both repositories
2. Review the code and inline documentation
3. Open a new issue with detailed information about your setup and the problem

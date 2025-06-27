<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Delivery Routes API - A NestJS-based backend application for managing delivery routes with JWT authentication. The system handles route assignments, deliveries, and cancellations with proper validation and authorization.

## Features

- **JWT Authentication**: Secure authentication for all endpoints
- **Route Management**: Complete CRUD operations for delivery routes
- **Automatic OTP Generation**: Dynamic delivery confirmation codes
- **Data Persistence**: JSON file-based storage with in-memory caching
- **Role-based Access**: Users can only access their assigned routes
- **Status Workflow**: Proper route lifecycle management

## API Endpoints

### Authentication
- `POST /auth/sign-in` - User authentication, returns JWT token
- `POST /auth/sign-up` - User registration
- `POST /auth/confirm-sign-up` - Confirm user registration with OTP
- `POST /auth/password-reset` - Request password reset
- `POST /auth/confirm-password-reset` - Confirm password reset with OTP

### Routes Management
- `GET /routes/pending` - Get all pending routes available for assignment
- `GET /routes/assigned` - Get assigned routes for authenticated delivery person
- `GET /routes/assigned/:id` - Get full details of a specific assigned route
- `POST /routes/:id/assign` - Assign a pending route to authenticated delivery person
- `POST /routes/:id/deliver/:confirmationCode` - Mark route as delivered
- `POST /routes/:id/cancel` - Cancel assigned route and return to pending status

## Route Status Flow
```
PENDING → ON_ROUTE → COMPLETED
    ↖               ↙
      (cancel route)
```

## NodeJS install

Instal NodeJS by following the steps appropriate to your os as described in the [NodeJS Official Webpage](https://nodejs.org)

## Project setup

```bash
$ npm install
```

## Configure

To create the configuration copy the .env.example file and rename it as .env

## Environment Variables

Create a `.env` file from `.env.example` and configure:

```bash
# JWT Configuration
JWT_SECRET="your-jwt-secret-key"

# Email Configuration (Optional)
COMMUNICATION_SERVICES_CONNECTION_STRING="your-azure-connection-string"
FROM_EMAIL_ADDRESS="donotreply@azuremanagedsubdomain.com"
MAILING_ENABLED=true
```

## Project Structure

```
src/
├── common/              # Shared utilities and guards
│   ├── guards/         # Authentication guards
│   ├── interceptors/   # Logging interceptors
│   ├── cache/          # In-memory caching
│   └── utils.ts        # Utility functions (OTP generation)
├── modules/
│   ├── auth/           # Authentication module
│   │   ├── repositories/  # User data management
│   │   └── dtos/       # Data transfer objects
│   └── routes/         # Routes management module
│       ├── repositories/  # Route data management
│       ├── dtos/       # Route DTOs and responses
│       └── data/       # JSON data files
└── main.ts             # Application entry point
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the API

### Using Postman

1. **Authentication Setup**
   - Create a POST request to `/auth/sign-in`
   - Body: `{ "email": "user@example.com", "password": "password123" }`
   - Copy the returned JWT token

2. **Add Authorization Header**
   - For all route endpoints, add header: `Authorization: Bearer <your-jwt-token>`

3. **Example Requests**
   ```bash
   # Get pending routes
   GET /routes/pending
   
   # Assign a route
   POST /routes/1d9319ff-e1d4-452e-9a71-7df1985a8c14/assign
   
   # Deliver a route (use the generated confirmation code)
   POST /routes/1d9319ff-e1d4-452e-9a71-7df1985a8c14/deliver/123456
   
   # Cancel a route
   POST /routes/1d9319ff-e1d4-452e-9a71-7df1985a8c14/cancel
   ```

### Postman Pre-request Script for Auto-Authentication

```javascript
// Pre-request Script
const signInUrl = 'http://localhost:3000/auth/sign-in';
const email = 'deliveryPerson@example.com';
const password = 'password123';

const token = pm.environment.get('jwt_token');
const tokenExpiry = pm.environment.get('token_expiry');

if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
    pm.sendRequest({
        url: signInUrl,
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: {
            mode: 'raw',
            raw: JSON.stringify({ email: email, password: password })
        }
    }, function (err, res) {
        if (err) {
            console.log('Error during sign-in:', err);
        } else {
            const responseJson = res.json();
            if (responseJson.token) {
                pm.environment.set('jwt_token', responseJson.token);
                pm.environment.set('token_expiry', Date.now() + (60 * 60 * 1000)); // 1 hour
                console.log('Token refreshed successfully');
            }
        }
    });
}
```

## Security Features

- **JWT Authentication**: All endpoints require valid authentication
- **User Authorization**: Users can only access their assigned routes
- **Automatic OTP Generation**: Delivery confirmation codes generated per assignment
- **Status Validation**: Strict status transition rules
- **Data Persistence**: All changes automatically saved to JSON files

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
```

## Enable email sending functionality

Emails in this application are sent using [Azure Communication Services](https://azure.microsoft.com/en-us/products/communication-services). When not configured the email will be rendered as a preview.

To configure it to send real emails follow this steps:
- Create an [Azure Portal](https://azure.microsoft.com/en-us/free/students) account using the student discount (with your .uade.ar email)
- Create an email communication resource in azure following the steps described [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/create-email-communication-resource?pivots=platform-azp).
- Copy the connection string from the keys section of the communication service created in the last step.
- Add a free Azure managed subdomain following the steps described [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/add-azure-managed-domains?pivots=platform-azp)
- Copy the default donotreply fromEmailAddress created automatically in the last step.
- Configure the `.env` file by copying `.env.example` and modifying the following email related env variables:

```
COMMUNICATION_SERVICES_CONNECTION_STRING="your-connection-string"
FROM_EMAIL_ADDRESS="donotreply@azuremanagedsubdomain.com"
MAILING_ENABLED=true
```
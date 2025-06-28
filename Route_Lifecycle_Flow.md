# Route Lifecycle and Validation Flow

## Route Status Lifecycle

```mermaid
flowchart TD
    A[Route Created] --> B[Status: PENDING]
    B --> C{Delivery Person Assigns Route}

    C -->|POST /routes/:id/assign/:confirmationCode<br/>Valid Assignment Code| D[Status: ON_ROUTE]
    C -->|Invalid Assignment Code/Unauthorized| E[Assignment Rejected]
    E --> B

    D --> F{Route Action}

    F -->|POST /routes/:id/deliver/:code<br/>Valid Confirmation Code| G[Status: COMPLETED]
    F -->|POST /routes/:id/cancel<br/>By Assigned Person| H[Return to PENDING]
    F -->|Invalid Delivery Code/Unauthorized| I[Action Rejected]

    H --> B
    I --> D
    G --> J[Route Finished]

    %% Styling
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style D fill:#f3e5f5
    style G fill:#e8f5e8
    style J fill:#e8f5e8
    style E fill:#ffebee
    style I fill:#ffebee
```

## Detailed Route Assignment Flow

```mermaid
sequenceDiagram
    participant DP as Delivery Person
    participant API as Routes API
    participant Auth as Auth Guard
    participant Service as Routes Service
    participant Repo as Repository
    participant File as JSON File

    DP->>API: POST /routes/{id}/assign/{confirmationCode}
    API->>Auth: Validate JWT Token
    Auth-->>API: Extract User Email

    API->>Service: assignRoute(id, confirmationCode, userEmail)
    Service->>Repo: findByEmail(userEmail)
    Repo-->>Service: User Data
    Service->>Repo: findById(id)
    Repo-->>Service: Route Data

    alt Route Available
        Service->>Service: Validate Status = PENDING
        Service->>Service: Validate Assignment Confirmation Code
        Service->>Service: Generate OTP for Delivery
        Service->>Service: Update Status to ON_ROUTE
        Service->>Repo: updateRoute(id, updatedRoute)
        Repo->>File: saveRoutesToFile()
        File-->>Repo: Success
        Repo-->>Service: Updated Route
        Service-->>API: Success Response
        API-->>DP: Route Assigned Successfully
    else Route Not Available
        Service-->>API: ForbiddenException
        API-->>DP: 403 Invalid Assignment Code or Route Not Available
    end
```

## Route Delivery Flow

```mermaid
sequenceDiagram
    participant DP as Delivery Person
    participant API as Routes API
    participant Service as Routes Service
    participant Repo as Repository
    participant File as JSON File

    DP->>API: POST /routes/{id}/deliver/{confirmationCode}
    API->>Service: deliverRoute(id, code, userEmail)

    Service->>Repo: findById(id)
    Repo-->>Service: Route Data

    alt Valid Delivery
        Service->>Service: Validate Status = ON_ROUTE
        Service->>Service: Validate User = Assigned Person
        Service->>Service: Validate Confirmation Code
        Service->>Service: Update Status to COMPLETED
        Service->>Service: Set deliveredAt timestamp
        Service->>Repo: updateRoute(id, updatedRoute)
        Repo->>File: saveRoutesToFile()
        Service-->>API: Success
        API-->>DP: Route Delivered Successfully
    else Invalid Delivery
        Service-->>API: ForbiddenException
        API-->>DP: 403 Invalid Delivery Attempt
    end
```

## Route Cancellation Flow

```mermaid
sequenceDiagram
    participant DP as Delivery Person
    participant API as Routes API
    participant Service as Routes Service
    participant Repo as Repository
    participant File as JSON File

    DP->>API: POST /routes/{id}/cancel
    API->>Service: cancelRoute(id, userEmail)

    Service->>Repo: findById(id)
    Repo-->>Service: Route Data

    alt Valid Cancellation
        Service->>Service: Validate Status = ON_ROUTE
        Service->>Service: Validate User = Assigned Person
        Service->>Service: Reset Status to PENDING
        Service->>Service: Remove Delivery Information
        Service->>Repo: updateRoute(id, updatedRoute)
        Repo->>File: saveRoutesToFile()
        Service-->>API: Success
        API-->>DP: Route Cancelled Successfully
    else Invalid Cancellation
        Service-->>API: ForbiddenException
        API-->>DP: 403 Cannot Cancel Route
    end
```

## Validation Rules Summary

```mermaid
graph LR
    A[Route Assignment] --> A1[Route Status = PENDING]
    A --> A2[User Authenticated]
    A --> A3[Route Exists]
    A --> A4[Valid Assignment Confirmation Code]

    B[Route Delivery] --> B1[Route Status = ON_ROUTE]
    B --> B2[User = Assigned Person]
    B --> B3[Valid Confirmation Code]
    B --> B4[Route Exists]

    C[Route Cancellation] --> C1[Route Status = ON_ROUTE]
    C --> C2[User = Assigned Person]
    C --> C3[Route Exists]

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff8e1
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthGuard
    participant JWT
    participant Service

    Client->>AuthGuard: Request with Bearer Token
    AuthGuard->>JWT: Validate Token

    alt Valid Token
        JWT-->>AuthGuard: User Email
        AuthGuard->>Client: Inject authUserEmail in Request
        Client->>Service: API Call with User Context
        Service-->>Client: Authorized Response
    else Invalid Token
        JWT-->>AuthGuard: Invalid
        AuthGuard-->>Client: 401 Unauthorized
    end
```

## Key Features

### Security

- **JWT Authentication**: All endpoints require valid authentication
- **Authorization**: Users can only access/modify routes assigned to them
- **Automatic OTP Generation**: Delivery confirmation codes generated per assignment
- **Status Validation**: Strict status transition rules

### Data Management

- **In-Memory Performance**: Fast operations with Map-based storage
- **File Persistence**: Automatic JSON file synchronization
- **Consistent State**: Data integrity across server restarts

### Error Handling

- **Comprehensive Validation**: Multi-layer validation (authentication, authorization, business rules)
- **Descriptive Errors**: Clear error messages for debugging
- **Proper HTTP Codes**: Standard HTTP status codes for different error types

# 🚀 Twiggy — Enterprise Food Delivery Platform

Twiggy is a subscription-based food delivery platform designed with a robust Service-Oriented Architecture (SOA). It seamlessly handles high-frequency real-time delivery tracking, persistent subscription and billing management, and AI-driven menu optimization.

## 🏗 Architecture Overview

The system strictly decouples its persistent and real-time components to achieve high scalability:
- **Real-time Layer:** Redis (Handles fast, volatile data like GPS tracking and caching)
- **Persistent Layer:** MongoDB (Durable, consistent data for subscriptions, orders, and users)
- **Asynchronous Task Queue:** RabbitMQ (Decouples services like email notifications and order generation)

```mermaid
graph TD
    Client[React App / Vite] --> API[API Gateway / Express]
    API --> Services[Auth | Subscription | Orders]
    Services --> Mongo[(MongoDB)]
    Services --> Redis[(Redis)]
    Services --> RabbitMQ((RabbitMQ))
```

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Material UI
- **3D UI Engine:** Three.js (for interactive storytelling)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Databases:** MongoDB & Redis
- **Message Broker:** RabbitMQ
- **Task Scheduling:** Node-cron (for 9 PM order generation cutoff)

### Third-party Services
- **AI Engine:** Gemini API (Menu optimization)
- **Authentication:** Passport.js (OAuth 2.0 & JWT)
- **Email Service:** EmailJS (Password reset & confirmations)

## 🔑 Key Features
- **Hybrid Authentication:** Support for traditional Email/Password and OAuth 2.0 (Google/GitHub).
- **Multi-Role Dashboards:** Distinct dashboards for Consumers, Providers, Delivery Partners, and Admins.
- **AI Menu Optimization:** AI-driven menu generation balancing historical ratings and ingredient costs.
- **Real-time Tracking:** 5-second interval GPS push from Delivery Partners, cached in Redis and pushed to the client.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose (for local Redis and RabbitMQ)
- MongoDB Cluster

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajrai-02/twiggy.git
   cd twiggy
   ```

2. **Start Local Services (Redis & RabbitMQ):**
   ```bash
   docker-compose up -d
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Development Servers:**
   - *Backend:* `npm run dev` (inside `/backend`)
   - *Frontend:* `npm run dev` (inside `/frontend`)

## 🛡 Security
This application implements industry-standard security practices including rate limiting, CSRF protection, input validation via Joi/Zod, secure HTTP-only cookies, token rotation, and strict HTTPS enforcement.

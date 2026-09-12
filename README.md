# Pulse_Blend_Media — Full-Stack-Ready Architecture

Welcome to **Pulse_Blend_Media**, a creative studio portfolio & booking application built with React, Vite, and a full-stack-ready architecture prepared for seamless database and backend integration (including Supabase).

---

## 🏗️ Architecture Overview

The codebase is refactored into a **clean repository-based layered architecture**. Components never query static data arrays or database endpoints directly; all data requests flow through custom hooks, services, and repository abstractions.

```
React UI Layer (Components / Sections)
       ↓
Custom React Hooks (useServices, useProjects, useTestimonials, useBooking, useContact)
       ↓
Business Service Layer (bookingService, projectService, serviceService, contactService, invoiceService)
       ↓
Repository Abstraction Layer (serviceRepository, projectRepository, testimonialRepository, bookingRepository)
       ↓
Current: Local Static Data / localStorage
Future: Supabase DB / REST API (Zero UI changes required)
```

---

## 📁 Directory Structure

```
d:/portfolio_website/
├── server/                     # Full-Stack Express Backend API (Ready for deployment)
│   ├── config/env.js           # Server environment config
│   ├── controllers/            # Route handlers (booking, contact, project, service)
│   ├── middleware/             # Error handler, input validation, rate limiting
│   ├── repositories/           # Server-side repositories
│   ├── routes/                 # API REST routes (/api/services, /api/bookings, etc.)
│   ├── services/               # Server-side business logic
│   └── server.js               # Node.js server entry point
│
├── src/                        # React Frontend Application
│   ├── api/                    # Generic API HTTP client & endpoint routes
│   │   ├── client.js
│   │   └── endpoints.js
│   ├── config/                 # Environment variables abstraction
│   │   └── env.js
│   ├── components/             # Reusable UI Components
│   │   ├── common/             # Loader, ErrorMessage, EmptyState, Button
│   │   ├── BookingModal/       # Service Booking Form & Success view
│   │   ├── BookingInvoice/     # Printable invoice & PDF download
│   │   └── ...
│   ├── data/                   # Single source of truth for fallback static data
│   │   ├── servicesData.js
│   │   ├── projectsData.js
│   │   ├── testimonialsData.js
│   │   └── legalDocuments.js
│   ├── hooks/                  # Data Custom Hooks
│   │   ├── useServices.js
│   │   ├── useProjects.js
│   │   ├── useTestimonials.js
│   │   ├── useBooking.js
│   │   └── useContact.js
│   ├── repositories/           # Data Access Layer
│   │   ├── serviceRepository.js
│   │   ├── projectRepository.js
│   │   ├── testimonialRepository.js
│   │   └── bookingRepository.js
│   ├── services/               # Business Service Operations
│   │   ├── bookingService.js
│   │   ├── projectService.js
│   │   ├── serviceService.js
│   │   ├── fileService.js
│   │   ├── invoiceService.js
│   │   └── notificationService.js
│   ├── utils/                  # Centralized helpers & validation
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validation.js
│   │   └── helpers.js
│   └── sections/               # Page Sections (Hero, Services, Works, About, Contact, Footer)
│
├── .env                        # Local Environment variables (git-ignored)
├── .env.example                # Environment Documentation Template
└── .gitignore                  # Git protection rules
```

---

## 🛠️ Environment Configuration

Environment variables are managed cleanly via `src/config/env.js`.

### Variable Definitions

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_APP_NAME` | Name of the web application | `Pulse_Blend_Media` |
| `VITE_APP_URL` | Application base frontend URL | `http://localhost:5173` |
| `VITE_API_BASE_URL` | API backend server base URL | `http://localhost:5000/api` |
| `VITE_WHATSAPP_NUMBER` | Owner contact mobile number | `+91 6304834605` |
| `VITE_SUPABASE_URL` | Supabase project URL (Future DB) | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase client anon public key | `your-anon-public-key` |

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Frontend Dev Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 📖 Developer Guides: Extending Data & Features

### 1. How to Add a New Primary Service
1. Open [`src/data/servicesData.js`](file:///d:/portfolio_website/src/data/servicesData.js).
2. Add a new object to the `servicesData` array:
   ```javascript
   {
     num: "08",
     tag: "BRAND STRATEGY",
     title: "Brand Strategy",
     description: "Comprehensive visual branding & identity guidelines.",
     priceLabel: "PRICING",
     priceValue: "Flexible pricing",
     btnText: "BOOK THIS SERVICE →",
     btnLink: "#book",
     isCustom: false
   }
   ```
3. Update `PRIMARY_SERVICES` in [`src/utils/constants.js`](file:///d:/portfolio_website/src/utils/constants.js).
4. **Result**: The UI automatically updates across the Services section, select dropdowns, and validation logic without editing any component code.

### 2. How to Add a New Portfolio Project
1. Open [`src/data/projectsData.js`](file:///d:/portfolio_website/src/data/projectsData.js).
2. Add an entry to the `projectsData` array:
   ```javascript
   {
     id: "09",
     title: "Cinematic Film — 09",
     category: "VIDEO",
     description: "Cinematic drone footage and color grading project.",
     image: "/path-to-image.jpg",
     tag: "VIDEO",
     link: "#"
   }
   ```
3. The project filtering and card grids update automatically via `useProjects()`.

### 3. How to Plug in Supabase in the Future
To connect Supabase database tables:
1. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
2. Open repository files (e.g. [`src/repositories/serviceRepository.js`](file:///d:/portfolio_website/src/repositories/serviceRepository.js) or [`src/repositories/bookingRepository.js`](file:///d:/portfolio_website/src/repositories/bookingRepository.js)).
3. Update repository functions to query `supabase.from('table')`.
4. **Zero changes are required inside your React UI components!**

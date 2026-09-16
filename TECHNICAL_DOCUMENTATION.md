# APPLICATION TECHNICAL DOCUMENTATION

---

## 1. Application Overview

* **Application Name**: `Pulse_Blend_Media` Portfolio & Service Booking Application
* **Purpose of the Application**: A high-end interactive portfolio website and automated client service booking system designed for a multimedia production agency (**Pulse_Blend_Media**).
* **Main Problem It Solves**: 
  1. Showcases multimedia portfolio items (video editing, graphic design, animation, etc.) with responsive interactive cards and scroll-driven frame canvas animations.
  2. Eliminates manual intake friction by allowing clients to submit custom service bookings, upload project reference files, calculate estimated budgets, and immediately generate downloadable PDF provisional invoices.
  3. Seamlessly routes client bookings and notifications via automated WhatsApp links and persistent backend database storage.
* **Target Users**:
  * **Clients / Prospects**: Individuals and businesses seeking video editing, branding, 3D animation, and design services.
  * **Agency Owners / Freelancers**: Pulse_Blend_Media agency operators who receive booking leads and uploaded reference assets.
* **Main Features**:
  * Interactive portfolio showcase with category filtering (`ALL`, `VIDEO EDITING`, `GRAPHIC DESIGN`, `BRANDING`, `ANIMATION`, `WEBSITE DEVELOPMENT`).
  * Interactive service catalog modal with custom budget calculation.
  * Multi-step booking request workflow with live file upload support.
  * Direct Client-to-Supabase Storage file upload handling (`client-files` bucket).
  * Automated Provisional Booking Invoice generation with print and PDF export capability (`jspdf` + `html2canvas`).
  * One-click owner notification via WhatsApp API (`https://wa.me/`).
  * High-performance HTML5 Canvas scroll-sequence animation system.
* **Overall Workflow**:
  1. **Discovery**: User explores services, testimonials, and past works with scroll animations and interactive modal dialogs.
  2. **Booking**: User opens the Booking Modal, selects a service, enters requirements, uploads reference files, and submits the form.
  3. **Data & File Storage**: Files are uploaded directly to Supabase Storage (`client-files`), and booking details are saved into the Supabase PostgreSQL database (`service_bookings`).
  4. **Invoice & Notification**: Client receives a unique booking ID (e.g., `PBM-2026-8K9F2`) and can instantly open/print/download a provisional invoice HTML/PDF page or notify the owner via WhatsApp.

---

## 2. Technology Stack

### Frontend

* **Framework / Library**: React (`v18.3.1`)
  * *Evidence*: [`package.json`](file:///d:/portfolio_website/package.json), [`src/App.jsx`](file:///d:/portfolio_website/src/App.jsx)
* **Programming Language**: JavaScript (ES6+ / JSX), HTML5, CSS3
  * *Evidence*: [`src/main.jsx`](file:///d:/portfolio_website/src/main.jsx)
* **Build Tool**: Vite (`v5.4.2`) with `@vitejs/plugin-react` (`v4.3.1`)
  * *Evidence*: [`vite.config.js`](file:///d:/portfolio_website/vite.config.js)
* **Styling Technology**: Vanilla CSS with CSS Custom Properties (Variables)
  * *Evidence*: [`src/styles/global.css`](file:///d:/portfolio_website/src/styles/global.css), [`src/styles/variables.css`](file:///d:/portfolio_website/src/styles/variables.css), [`src/styles/reset.css`](file:///d:/portfolio_website/src/styles/reset.css)
* **UI / Component Libraries**: Custom-built React components (No external UI library like MUI or Bootstrap).
  * *Evidence*: [`src/components/`](file:///d:/portfolio_website/src/components)
* **Animation Libraries**: Custom animations using Vanilla CSS transitions/keyframes, HTML5 Canvas 2D context, and standard browser Web APIs (`IntersectionObserver`, `requestAnimationFrame`). No external libraries like GSAP or Framer Motion.
  * *Evidence*: [`src/components/FrameCanvas/FrameCanvas.jsx`](file:///d:/portfolio_website/src/components/FrameCanvas/FrameCanvas.jsx), [`src/hooks/useScrollFrameAnimation.js`](file:///d:/portfolio_website/src/hooks/useScrollFrameAnimation.js), [`src/hooks/use3DTilt.js`](file:///d:/portfolio_website/src/hooks/use3DTilt.js)
* **Routing**: Custom lightweight routing in `main.jsx` based on URL inspection (`window.location.pathname`, `hash`, `search`). No `react-router-dom`.
  * *Evidence*: [`src/main.jsx`](file:///d:/portfolio_website/src/main.jsx)
* **State Management**: Built-in React Hooks (`useState`, `useEffect`) and custom hooks (`useBooking.js`, `useContact.js`, `useProjects.js`). No Redux or Zustand.
  * *Evidence*: [`src/hooks/`](file:///d:/portfolio_website/src/hooks)
* **API / Client Libraries**:
  * `@supabase/supabase-js` (`v2.116.0`): Client SDK for database queries and storage uploads. ([`src/lib/supabaseClient.js`](file:///d:/portfolio_website/src/lib/supabaseClient.js))
  * Custom `fetch` wrapper: Client-side API fetch module with fallback support. ([`src/api/client.js`](file:///d:/portfolio_website/src/api/client.js))
  * `jspdf` (`v4.2.1`) & `html2canvas` (`v1.4.1`): Client-side DOM to canvas and PDF generation. ([`src/lib/pdfGenerator.js`](file:///d:/portfolio_website/src/lib/pdfGenerator.js))

### Backend

* **Programming Language**: JavaScript (Node.js)
* **Runtime**: Node.js (CommonJS format in `server/`)
* **Framework**: Express (Code located in `server/server.js`)
  * *Note*: Express is present in the repository under `server/`, but `express` is **missing from `package.json` dependencies**. Production operations function as a **Serverless Backend-as-a-Service (BaaS)** via Supabase.
* **API Architecture**: REST API routes defined under `/api/*` in `server/routes/`.
* **Middleware**: Custom rate limiter (`server/middleware/rateLimiter.js`), custom error handler (`server/middleware/errorHandler.js`), Express `json`/`urlencoded` body parsers.
* **Authentication / Authorization**: Database Row Level Security (RLS) policies on Supabase PostgreSQL. No custom server-side JWT or session authentication is implemented.
* **Validation**: Client-side validation module ([`src/utils/validation.js`](file:///d:/portfolio_website/src/utils/validation.js)) and Express middleware ([`server/middleware/validation.js`](file:///d:/portfolio_website/server/middleware/validation.js)).
* **File Upload Handling**: Direct client-to-storage upload using `@supabase/supabase-js` to the `client-files` bucket.

### Database

* **Database Technology**: PostgreSQL (Managed on Supabase Cloud)
* **Database Provider**: Supabase Cloud (`https://<project-id>.supabase.co`)
* **Supabase Services Breakdown**:
  * **PostgreSQL Database**: Relational tables (`service_bookings`, `booking_files`, `contact_submissions`).
  * **Supabase Auth**: Utilized for Row Level Security (RLS) role checking (`TO public WITH CHECK (true)` / `USING (true)`).
  * **Supabase Storage**: Private storage bucket `client-files` storing client reference files with signed URL access.
  * **Supabase SDK**: `@supabase/supabase-js` initialized in [`src/lib/supabase.js`](file:///d:/portfolio_website/src/lib/supabase.js).

### Deployment

* **Frontend Hosting**: Vercel Static/Multi-page deployment
* **Backend Hosting**: Serverless BaaS via Supabase (Node/Express backend code is currently un-deployed).
* **Database Hosting**: Supabase Managed Database Cloud
* **Storage Hosting**: Supabase Managed Storage Cloud
* **Environment Configuration**: Vite environment variables (`.env`, `.env.local`, `.env.example`).
* **Deployment Configuration**: [`vercel.json`](file:///d:/portfolio_website/vercel.json), [`vite.config.js`](file:///d:/portfolio_website/vite.config.js)

---

## 3. Architecture

### Application Data Flow

```
User (Browser)
    │
    ├─── Render UI & Animations (React + Custom CSS + Canvas 2D)
    │
    ├─── Submit Booking / Contact Form & Upload Files
    │        │
    │        ▼
    │   @supabase/supabase-js Client SDK
    │        │
    │        ├─── Database Insert ──► Supabase PostgreSQL Database
    │        │                         (Tables: service_bookings, contact_submissions)
    │        │
    │        └─── File Upload ──────► Supabase Storage
    │                                  (Bucket: client-files)
    │
    └─── View Projects / Services / Testimonials
             │
             ├─── Fetch Request (http://localhost:5000/api) ──► (Offline / Local Mode)
             │                                                          │
             └────── Fallback to Local Data Arrays (src/data/*.js) ◄────┘
```

---

## 4. Project Folder Structure

```
portfolio_website/
├── .env                              # Environment variable configuration
├── .env.example                      # Environment template (secrets hidden)
├── .env.local                        # Local override environment settings
├── TECHNICAL_DOCUMENTATION.md        # Technical Documentation file
├── booking-invoice.html              # Multi-page Vite entry point for Provisional Invoice
├── dist/                             # Compiled production build output
├── index.html                        # Main single-page Vite HTML entry point
├── package.json                      # Project metadata & npm dependencies
├── README.md                         # Project documentation
├── vercel.json                       # Vercel deployment rewrite rules
├── vite.config.js                    # Vite multi-page build configuration
├── server/                           # Express backend codebase (Inactive in production)
│   ├── config/                       # Environment configuration loader
│   ├── controllers/                  # Route request handlers
│   ├── middleware/                   # Express middlewares (CORS, Rate Limiting, Error Handling)
│   ├── repositories/                 # Data access layer for backend routes
│   ├── routes/                       # Express REST API endpoints
│   ├── utils/                        # Logging & helper utilities
│   └── server.js                     # Express server entry point
├── src/                              # React frontend source code
│   ├── App.jsx                       # Main React application shell
│   ├── main.jsx                      # React entry point & custom route switch
│   ├── api/                          # HTTP client and REST endpoint definitions
│   │   ├── client.js                 # Fetch wrapper with offline fallback handling
│   │   └── endpoints.js              # Centralized API endpoint constants
│   ├── components/                   # Reusable UI component modules
│   │   ├── BookingInvoice/           # Invoice view, print & PDF generator component
│   │   ├── BookingModal/             # Multi-step booking form modal
│   │   ├── ContactForm/              # Client contact form component
│   │   ├── FrameCanvas/              # Scroll-driven Canvas animation player
│   │   ├── Header/                   # Floating navigation bar & status indicator
│   │   ├── LegalModal/               # Terms of Service & Privacy Policy viewer
│   │   ├── Preloader/                # Initial asset loading overlay
│   │   ├── ProjectCard/              # Portfolio item card with tilt & zoom
│   │   ├── ServiceCard/              # Service feature card component
│   │   ├── Testimonials/             # Client feedback carousel component
│   │   └── common/                   # Shared UI primitives (BookingFilesViewer, Modal)
│   ├── config/                       # Frontend environment configuration constants
│   ├── data/                         # Local static data arrays (Services, Projects, Legal)
│   ├── hooks/                        # Custom React hooks (useBooking, useScrollReveal, etc.)
│   ├── lib/                          # External SDK wrappers (Supabase, PDF Generator)
│   ├── repositories/                 # Data access abstraction layer for frontend
│   ├── sections/                     # Page section containers (Hero, About, Works, Services, etc.)
│   ├── services/                     # Business logic services (bookingService, storageService)
│   ├── styles/                       # Global CSS styles & design tokens
│   └── utils/                        # Validation & formatting utility functions
└── supabase/                         # Supabase database & storage setup
    └── migrations/                   # SQL migration scripts (001 to 006)
```

---

## 5. Frontend Documentation

### Key Pages and Views

#### 1. Main Landing Page (`/` or `index.html`)
* **Route**: `/`
* **Purpose**: Primary agency portfolio showcasing brand identity, services, portfolio items, testimonials, and contact triggers.
* **Important Components**:
  * [`Header.jsx`](file:///d:/portfolio_website/src/components/Header/Header.jsx): Floating navigation header.
  * [`Hero.jsx`](file:///d:/portfolio_website/src/sections/Hero/Hero.jsx): Introductory hero banner with CTA triggers.
  * [`FrameCanvas.jsx`](file:///d:/portfolio_website/src/components/FrameCanvas/FrameCanvas.jsx): Canvas-based scroll-driven sequence animation.
  * [`Services.jsx`](file:///d:/portfolio_website/src/sections/Services/Services.jsx): Grid of multimedia agency services.
  * [`Works.jsx`](file:///d:/portfolio_website/src/sections/Works/Works.jsx): Portfolio showcase with category filtering tabs.
  * [`Testimonials.jsx`](file:///d:/portfolio_website/src/components/Testimonials/Testimonials.jsx): Client testimonial feedback section.
  * [`BookingModal.jsx`](file:///d:/portfolio_website/src/components/BookingModal/BookingModal.jsx): Multi-step booking intake dialog.
* **API Calls**:
  * `saveServiceBooking()` on form submission.
  * `uploadClientFile()` for reference assets.
* **User Interactions**: Filter portfolio items, open service details, fill multi-step booking form, attach reference files, submit bookings, launch legal modals.

#### 2. Provisional Invoice Page (`/booking-invoice.html`)
* **Route**: `/booking-invoice.html?id=PBM-XXXX-XXXXX`
* **Purpose**: Displays printable and downloadable provisional invoice for submitted booking records.
* **Important Components**:
  * [`BookingInvoice.jsx`](file:///d:/portfolio_website/src/components/BookingInvoice/BookingInvoice.jsx): Renders client details, service breakdown, cost estimate, disclaimer banner, and action toolbar.
  * [`BookingFilesViewer.jsx`](file:///d:/portfolio_website/src/components/common/BookingFilesViewer.jsx): Securely lists uploaded reference files with signed URL view buttons.
* **API Calls**:
  * `getInvoiceData(bookingId)`: Fetches booking record from Supabase database or local storage cache.
  * `createSignedUrl()`: Resolves temporary signed preview URLs for private files in Supabase Storage.
* **User Interactions**: Download invoice as PDF (`jspdf` + `html2canvas`), print invoice (`window.print()`), notify owner via WhatsApp.

---

## 6. Backend Documentation

### Server Entry & Configuration

* **Entry File**: [`server/server.js`](file:///d:/portfolio_website/server/server.js)
* **Server Setup**: Express app listening on port specified in `server/config/env.js` (default: 5000).
* **Configured Middlewares**: Express JSON parser (`limit: 10mb`), URL encoded parser (`limit: 10mb`), custom CORS header middleware, custom rate limiter middleware (60 requests per minute).

### API Routes Table

| Method | Endpoint | Purpose | Authentication | Controller / Handler |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | Health check endpoint | Public | Inline handler in `server.js` |
| `GET` | `/api/services` | Get all services | Public | `serviceController.getAllServices` |
| `GET` | `/api/projects` | Get all portfolio projects | Public | `projectController.getAllProjects` |
| `GET` | `/api/testimonials` | Get all client testimonials | Public | `testimonialController.getAllTestimonials` |
| `POST` | `/api/bookings` | Create new service booking | Public (Body Validated) | `bookingController.createBooking` |
| `GET` | `/api/bookings/:id` | Get booking details by ID | Public | `bookingController.getBookingById` |
| `POST` | `/api/contact` | Submit contact enquiry | Public (Body Validated) | `contactController.submitContact` |

---

## 7. Database Documentation

### Database Configuration
* **Database Type**: Relational PostgreSQL
* **Provider**: Supabase Cloud Platform
* **Connection Method**: Connection via `@supabase/supabase-js` SDK over HTTPS REST/PostgREST.

### Database Tables

| Table Name | Purpose | Key Columns | Relationships |
| --- | --- | --- | --- |
| `service_bookings` | Stores customer booking requests | `id` (UUID PK), `booking_id` (TEXT UNIQUE), `full_name`, `email`, `service`, `estimated_budget`, `uploaded_files` (JSONB), `status`, `created_at` | Referenced by `booking_files.booking_id` |
| `booking_files` | Stores metadata for uploaded reference files | `id` (UUID PK), `booking_id` (UUID FK), `booking_code` (TEXT), `file_name`, `storage_path`, `mime_type`, `file_size`, `created_at` | Foreign Key → `service_bookings.id` (ON DELETE CASCADE) |
| `contact_submissions` | Stores client contact form entries | `id` (UUID PK), `full_name`, `email`, `phone`, `service`, `message`, `created_at` | None |

### CRUD Operations

* **Create (`INSERT`)**:
  * **Service Bookings**: Implemented in [`src/lib/supabaseClient.js`](file:///d:/portfolio_website/src/lib/supabaseClient.js) via `saveServiceBooking()`.
  * **Contact Submissions**: Implemented in [`src/lib/supabaseClient.js`](file:///d:/portfolio_website/src/lib/supabaseClient.js) via `saveContactSubmission()`.
* **Read (`SELECT`)**:
  * **Get Booking by ID**: Implemented in [`src/lib/supabaseClient.js`](file:///d:/portfolio_website/src/lib/supabaseClient.js) via `getBookingRecord(bookingId)`.
* **Update (`UPDATE`)**: Not implemented in frontend client (Administrators manage status updates via Supabase Dashboard).
* **Delete (`DELETE`)**: Cascading delete configured on `booking_files` foreign key constraint.

---

## 8. Authentication & Authorization

* **Login / Registration**: **Not implemented / Cannot confirm from the repository.** (No user registration, user login, or session login flow is present in code).
* **Protected Routes**: **Not implemented / Cannot confirm from the repository.**
* **User Roles**: **Not implemented / Cannot confirm from the repository.**
* **Database Authorization Rules (Row Level Security)**:
  * Configured in [`supabase/migrations/004_security_and_indexes.sql`](file:///d:/portfolio_website/supabase/migrations/004_security_and_indexes.sql).
  * `service_bookings`: Public `INSERT` (`WITH CHECK (true)`), Public `SELECT` (`USING (true)`).
  * `contact_submissions`: Public `INSERT` (`WITH CHECK (true)`).
  * `storage.objects`: Public `INSERT` for bucket `client-files` and public/signed-url `SELECT` for bucket `client-files` ([`006_storage_rls_policies.sql`](file:///d:/portfolio_website/supabase/migrations/006_storage_rls_policies.sql)).

---

## 9. Image and File Storage

### File Upload & Retrieval Flow

```
User selects reference file in Booking Modal
    │
    ▼
Frontend (`src/services/storageService.js` - `uploadClientFile()`)
    │
    ▼
Supabase Storage API (`supabase.storage.from('client-files').upload()`)
    │
    ▼
Private Supabase Storage Bucket (`client-files/{booking_id}/{filename}`)
    │
    ▼
Returns File Reference Object `{ name, path, bucket, type, size, uploaded_at }`
    │
    ▼
Inserted into `service_bookings.uploaded_files` JSONB column in PostgreSQL
    │
    ▼
Invoice page requests signed URL (`supabase.storage.from('client-files').createSignedUrl(path, 3600)`)
    │
    ▼
Frontend renders image preview / download link in `BookingFilesViewer.jsx`
```

---

## 10. Environment Variables

| Variable | Purpose | Used By | Exposed to Browser |
| --- | --- | --- | --- |
| `VITE_APP_NAME` | Application title display | Frontend config | Yes |
| `VITE_APP_URL` | Base frontend URL | Frontend config | Yes |
| `VITE_API_BASE_URL` | Backend Express API base URL | Frontend API client | Yes |
| `VITE_WHATSAPP_NUMBER` | Agency WhatsApp contact number | BookingModal & Invoice | Yes |
| `VITE_WHATSAPP_WEBHOOK_URL` | Optional WhatsApp webhook URL | Notification service | Yes |
| `VITE_SUPABASE_URL` | Supabase Cloud project URL | Supabase Client SDK | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Supabase Client SDK | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key | Supabase Client SDK | Yes (Public API key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side administrative key | Express Backend | No (Secret value hidden) |

---

## 11. API → Database Flow

### Detailed Step-by-Step Execution Trace for Service Booking

1. **User Form Submission**: User completes form in `BookingModal.jsx` and clicks "Confirm Booking".
2. **Form Validation**: `useBooking.js` passes input to [`src/utils/validation.js`](file:///d:/portfolio_website/src/utils/validation.js) (`validateBookingForm`).
3. **Business Logic Execution**: `bookingService.submitBooking()` builds structured customer, service, and consent payload.
4. **Data Access Delegation**: `bookingRepository.createBooking()` calls `saveServiceBooking()` in [`src/lib/supabaseClient.js`](file:///d:/portfolio_website/src/lib/supabaseClient.js).
5. **Storage Upload Loop**: For each attached file, `storageService.uploadClientFile()` executes `supabase.storage.from('client-files').upload()`.
6. **Database Insert**: `saveServiceBooking()` executes `supabase.from('service_bookings').insert([dbBookingPayload])`.
7. **Local Cache Backup**: Booking record is stored in `localStorage` (`PBM_LATEST_BOOKING`) for instant fallback rendering.
8. **UI State Update**: `BookingModal.jsx` transitions to Thank You screen, displaying generated Booking ID and invoice view link (`/booking-invoice.html?id=PBM-...`).

---

## 12. Application Features

### 1. Interactive Portfolio Showcase
* **Purpose**: Displays past multimedia agency projects categorized by domain.
* **Frontend**: [`Works.jsx`](file:///d:/portfolio_website/src/sections/Works/Works.jsx), [`ProjectCard.jsx`](file:///d:/portfolio_website/src/components/ProjectCard/ProjectCard.jsx).
* **Backend / DB**: Uses [`projectRepository.js`](file:///d:/portfolio_website/src/repositories/projectRepository.js) with fallback to static array in [`projectsData.js`](file:///d:/portfolio_website/src/data/projectsData.js).

### 2. Multi-Step Service Booking Intake
* **Purpose**: Collects project scope, client contact details, preferred schedule, and estimated budget.
* **Frontend**: [`BookingModal.jsx`](file:///d:/portfolio_website/src/components/BookingModal/BookingModal.jsx), [`useBooking.js`](file:///d:/portfolio_website/src/hooks/useBooking.js).
* **Database**: Inserts record into `service_bookings` table in Supabase PostgreSQL.

### 3. File Reference Upload & Signed URL Viewing
* **Purpose**: Allows clients to upload sample assets during booking and lets owners/clients securely preview them.
* **Storage**: Supabase Storage bucket `client-files`.
* **Frontend Component**: [`BookingFilesViewer.jsx`](file:///d:/portfolio_website/src/components/common/BookingFilesViewer.jsx).

### 4. Provisional Invoice Generation & PDF Export
* **Purpose**: Renders clean booking invoice with print and PDF download buttons.
* **Frontend Component**: [`BookingInvoice.jsx`](file:///d:/portfolio_website/src/components/BookingInvoice/BookingInvoice.jsx).
* **Libraries Involved**: `jspdf` and `html2canvas` in [`src/lib/pdfGenerator.js`](file:///d:/portfolio_website/src/lib/pdfGenerator.js).

---

## 13. Security Review

| Severity | Issue Category | Description / Finding |
| --- | --- | --- |
| 🟠 **High** | Missing Express Dependency | `express` is imported in `server/server.js` but missing from `package.json`, causing backend execution failure if started. |
| 🟡 **Medium** | Public Storage RLS Policy | Storage RLS policy in [`006_storage_rls_policies.sql`](file:///d:/portfolio_website/supabase/migrations/006_storage_rls_policies.sql) allows `public` SELECT access on `client-files` bucket. |
| 🟡 **Medium** | Direct Client DB Inserts | Anonymous browser clients insert directly into PostgreSQL database without server-side validation or captcha verification. |
| 🟢 **Low** | File Upload Sanitization | Storage service sanitizes file names using regex `file.name.replace(/[^a-zA-Z0-9._-]/g, '_')`. |
| ℹ️ **Info** | Secrets Security | Secrets are kept out of committed git history. Environment keys use `VITE_` prefix for client exposure. |

---

## 14. Deployment Architecture

* **Frontend**: Deployed on **Vercel**
  * **Build Command**: `npm run build` (`vite build`)
  * **Output Directory**: `dist/`
  * **Routes Handled**: Multi-page inputs `index.html` and `booking-invoice.html` configured in `vite.config.js`.
* **Backend**: Serverless BaaS via **Supabase**
* **Database**: Managed **Supabase PostgreSQL Cloud**
* **Storage**: Managed **Supabase Storage Cloud**

---

## 15. Current Application Status

| Area | Status | Notes |
| --- | --- | --- |
| **Frontend** | ✅ Working | Responsive design, scroll animations, modals, invoice generator operational. |
| **BaaS Backend (Supabase)** | ✅ Working | Direct client insert to database and file upload to storage operational. |
| **Express Backend (`server/`)** | ⚠️ Incomplete | Un-deployed and missing `express` dependency in `package.json`. |
| **Database** | ✅ Working | Supabase PostgreSQL schema and migration scripts configured. |
| **Authentication** | ⚠️ Basic RLS | No user login system; relies on public RLS policies. |
| **Storage** | ✅ Working | Uploads to `client-files` bucket and generates signed preview URLs. |
| **Deployment** | ✅ Working | Deployed on Vercel with multi-page Vite build support. |

---

## 16. Known Issues

1. **Uninstalled Express Dependency**: `server/server.js` requires `express`, but `express` is not listed in `package.json`.
2. **CommonJS / ES Module Mismatch in Server Folder**: `package.json` specifies `"type": "module"`, while `server/server.js` uses CommonJS `require()`.
3. **Hardcoded Fallback API URL**: `src/config/env.js` defaults `API_BASE_URL` to `http://localhost:5000/api`, causing initial network fetch errors in browser console before falling back to local data.

---

## 17. Recommendations

### Must Fix
1. Install missing dependencies if Express server is intended to be used (`npm install express winston cors`).
2. Align `server/` module format (convert `require` to `import` statements or use `.cjs` file extension).

### Should Fix
1. Add Rate Limiting or CAPTCHA (e.g. Turnstile / reCAPTCHA) to the booking form to prevent spam submissions to Supabase database.
2. Restrict `client-files` Supabase Storage RLS policies so that only signed URLs can read uploaded client assets.

### Nice to Have
1. Add an admin dashboard for agency operators to view, update booking status (`UNDER_REVIEW`, `CONFIRMED`, `COMPLETED`), and send automated email updates.
2. Integrate a payment gateway (e.g. Razorpay / Stripe) into the provisional invoice page.

---

## 18. Final Architecture Summary

* **Frontend**: React (`v18.3.1`) + Vite (`v5.4.2`) + Vanilla CSS
* **Backend**: Supabase BaaS (Serverless Client SDK)
* **Database**: PostgreSQL (Supabase Managed Cloud)
* **Authentication**: Supabase Row Level Security (RLS)
* **Storage**: Supabase Storage (`client-files` bucket)
* **Deployment**: Vercel

### Final System Diagram

```
User (Browser)
    │
    ▼
React Frontend (Vite Multi-Page App on Vercel)
    │
    ├─── Direct BaaS Integration ──► @supabase/supabase-js
    │                                     │
    │                                     ├─── Database Inserts ──► Supabase PostgreSQL
    │                                     │                          (service_bookings)
    │                                     │
    │                                     └─── Reference Uploads ─► Supabase Storage
    │                                                                (client-files bucket)
    │
    └─── Offline / Local Mode ──────► Local Static Data Arrays
                                       (servicesData.js, projectsData.js)
```

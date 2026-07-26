# Product Requirements Document (PRD): BLITZ CRM - B2B Field Sales System

## 1. Project Overview
**BLITZ CRM** is a mobile-first, web-based Field Sales CRM designed for a B2B company offering bilingual education programs to schools across 3 islands in Indonesia (Sumatra, Java, Bali). 

### Branding Requirements
- **Application Name:** BLITZ CRM
- **Logo:** Use the logo file(s) located in the project root directory (e.g., `logo.png`, `logo.svg`).
- **Logo Placement:** Login page, Sidebar navigation, Mobile header, Favicon, Loading screen.

## 2. User Roles & Data Isolation (Strict RBAC)
1. **Super Admin:** Full system access, user management, global settings.
2. **Owner:** View all financial reports, global pipeline, and high-level analytics.
3. **Management:** Operational oversight. View/manage data across all 3 islands.
4. **Regional Sales:** Manages one specific island. View data *only* within their assigned island.
5. **Sales:** View and edit *only* their own assigned schools, visits, and pipeline.

## 3. Core Features
### 3.1. Dashboard & Analytics (Business Metrics)
- Role-specific dashboards.
- **Graphs (using Recharts):** Pipeline velocity (Bar chart), Visit completion vs Target (Line chart), School conversion rates (Pie chart).

### 3.2. School Mapping & Geofencing
- Interactive Map (React-Leaflet) showing schools. Color-coded markers by status.
- **Geofencing Check-in:** Captures GPS. Blocks check-in if distance > 100 meters from School coordinates.

### 3.3. Field Visit & School Survey (Mobile-First)
When a Sales agent checks in, they must fill out this specific Survey Form:
- **School Info:** School Name (auto-filled), Total Students (Number), Total Teachers (Number).
- **English Program:** Has existing English program? (Yes/No). If Yes, what is the program name? (Text).
- **PIC Info:** PIC Name, PIC Position, PIC Phone Number.
- **Visit Details:** Check-in/out time, GPS capture, Photo upload, Visit Notes.

### 3.4. Kanban Pipeline
Stages: `New Prospect` -> `Initial Contact` -> `School Visit Done` -> `Proposal Sent` -> `Negotiation` -> `Closed Won` / `Closed Lost`.

## 4. Data Model (Prisma Schema)
- `User`: id, name, email, passwordHash, roleId, islandId.
- `Role`: id, name (SUPER_ADMIN, OWNER, MANAGEMENT, REGIONAL, SALES).
- `Island`: id, name (SUMATRA, JAVA, BALI).
- `School`: id, name, address, latitude, longitude, islandId, status, assignedToUserId.
- `Visit`: id, schoolId, userId, checkInTime, checkOutTime, checkInLat, checkInLng, photoUrl.
- `VisitSurvey`: id, visitId, studentCount, teacherCount, hasEnglishProgram, existingProgramName, picName, picPosition, picPhone, visitNotes.
- `Opportunity`: id, schoolId, userId, stage, value, expectedCloseDate.

## 5. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & ORM:** PostgreSQL + Prisma
- **Authentication:** NextAuth.js (Auth.js v5)
- **Maps:** React-Leaflet (OpenStreetMap)
- **Charts:** Recharts (for business metrics)
- **Forms:** React Hook Form + Zod
- **AI Context Tooling:** Graphify (to maintain codebase knowledge graph for the AI assistant)

## 6. Base Repository & Execution Guide
### Base Repository to Clone:
- **Repo Link:** `https://github.com/ixartz/Next-js-Boilerplate.git`

### Logo Integration:
- Detect logo file(s) in the project root directory.
- Copy to `/public/logo/` and integrate into Login, Sidebar, Mobile Header, and Favicon.

### Graphify Integration (Crucial for AI Consistency):
- Initialize the Graphify skill in this project so the AI assistant (Claude Code) can query the codebase structure, Prisma schema, and RBAC logic without losing context across multiple development phases.

### Execution Guide (Step-by-Step):
1. **Environment Setup:** Clone base repo, install dependencies, setup `.env` with PostgreSQL `DATABASE_URL`.
2. **Graphify Init:** Run Graphify initialization to map the base structure.
3. **Database & Auth:** Setup Prisma schema, run migrations, seed roles/islands, configure NextAuth.
4. **Layout & Routing:** Build shadcn/ui layouts with BLITZ CRM branding, role-based middleware.
5. **Master Data & Maps:** Build School CRUD and React-Leaflet Map view with geofencing.
6. **Field Visit Flow:** Build mobile-first Check-in, GPS capture, and detailed `VisitSurvey` form.
7. **Dashboard & Kanban:** Implement Recharts for dashboards and drag-and-drop for Pipeline.
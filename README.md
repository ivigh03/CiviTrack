# CiviTrack — Smart Civic Issue Management System

> Turning citizen complaints into actionable insights — a full-stack platform for reporting, resolving, and tracking civic issues with real-time updates, AI-assisted classification, and SLA-based escalation.

---

## Overview

Civic issues — potholes, garbage overflow, water leakage, streetlight failures — often go unreported, ignored, or untracked, leaving citizens unheard and authorities without structured data to act on.

**CiviTrack** solves this with one unified system across three roles:

| Role | What they do |
|---|---|
| **Citizen** | Reports issues with a photo, description, and geolocation; tracks status; upvotes/downvotes complaints |
| **Staff** | Gets assigned complaints, resolves them, and uploads proof of resolution |
| **Admin** | Monitors everything via a live dashboard — stats, category/status breakdowns, complaint map, user management, SLA escalation |

---

## Features

### Citizen
- Sign up / log in with email + password or **Google OAuth**
- Submit a complaint with a photo, address (Geoapify autocomplete), and a map-based location picker (Leaflet)
- Get an **AI-generated suggestion** (title, category, severity/priority) from the uploaded photo before submitting, powered by Gemini
- View your own complaints and all complaints, filterable by category/area/date
- Upvote / downvote complaints
- View a live **heatmap** of reported issues
- Receive **real-time notifications** (assignment, resolution, escalation) via Socket.io

### Staff
- Dashboard of complaints currently assigned to you
- Move a complaint from *assigned* → *in-progress* → *resolved*
- Upload **proof-of-resolution** photo + remark on completion
- Real-time notification the moment a complaint is assigned to you

### Admin
- Aggregate dashboard: total/pending/resolved/escalated counts, category distribution (pie), status split, complaints-over-time (line) — via Recharts
- Complaint management: search/filter, assign or reassign staff (full **assignment history** kept per complaint), update status, delete, **export to CSV**
- User management: filter by role, change a user's role, block/unblock, delete
- Notification center: view, mark-read, mark-all-read, clear
- Live heatmap of all complaints
- **SLA monitoring**: overdue complaints are automatically flagged and admins are notified in real time (see [Complaint Lifecycle](#complaint-lifecycle))

### Platform-wide
- JWT authentication (7-day expiry) + Google OAuth, with role-based protection on both routes (client) and API endpoints (server)
- Real-time updates over Socket.io using per-user rooms (one `newNotification` event type covers complaint/assignment/resolution/escalation notifications, persisted in MongoDB)
- Image uploads (complaint photos, resolution proof) via Multer, served statically from `/uploads`

---

## Tech Stack

### Frontend (`client/`)
| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS, `clsx`, `tailwind-merge` |
| State | Redux Toolkit + `react-redux` |
| Routing | React Router v7 |
| HTTP | Axios |
| Real-time | `socket.io-client` |
| Maps | Leaflet, `react-leaflet`, `leaflet.heat` (location picker + heatmap) |
| Charts | Recharts |
| Animation | Framer Motion |
| UI primitives | Radix UI (dialog, tabs, tooltip), `cmdk` |
| Icons / toasts | `lucide-react`, `react-icons`, `sonner` |

### Backend (`server/`)
| Category | Technology |
|---|---|
| Runtime | Node.js + Express 5 (ES Modules) |
| Database | MongoDB via Mongoose |
| Auth | `jsonwebtoken` + `bcryptjs`, Google OAuth via `google-auth-library` |
| Real-time | Socket.io |
| File uploads | Multer |
| AI | `@google/genai` — Gemini 2.5 Flash for image-based complaint classification |
| Export | `json2csv` (admin complaint CSV export) |
| Config | `dotenv`, `cors` |

No TypeScript, no test framework, no CI/CD, no Docker.

---

## Project Structure

```
CiviTrack/
├── client/
│   └── src/
│       ├── api/               # axios instance + complaintApi.js
│       ├── app/store.js       # Redux store
│       ├── features/
│       │   ├── auth/          # authSlice.js — login/signup/Google, persisted to localStorage
│       │   └── complaints/    # complaintSlice.js
│       ├── components/{admin,citizen,dashboard,staff}/
│       ├── context/NotificationContext.jsx
│       ├── pages/             # Login, Signup, ComplaintForm, ComplaintDetail,
│       │                      # CitizenDashboard, StaffDashboard, admin/*
│       └── socket.js
│
└── server/
    ├── config/db.js               # Mongoose connection
    ├── controllers/                # auth, admin, complaint
    ├── middleware/authMiddleware.js  # JWT `protect`, `authorizeRoles`
    ├── models/                     # Complaint, User, Notification
    ├── routes/                     # authRoutes, adminRoutes, complaintRoutes
    ├── services/geminiService.js   # Gemini vision-based complaint classification
    ├── utils/                      # createNotification, checkEscalation
    ├── uploads/                    # uploaded images
    └── server.js                   # app entrypoint
```

---

## API Reference

All endpoints return JSON. Routes marked **Auth** require a valid JWT (`Authorization: Bearer <token>`); **Role** further restricts by user role.

### `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signup` | – | Register a new user |
| POST | `/login` | – | Email/password login |
| POST | `/google` | – | Google OAuth login (find-or-create citizen) |
| GET | `/me` | ✅ | Get the current authenticated user |

### `/api/complaints`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/analyze` | ✅ | Upload a photo, get an AI-suggested title/category/description/severity (Gemini) — does not create a complaint |
| POST | `/` | ✅ | Create a complaint (photo + description + location); sets a 48h SLA deadline and notifies admins |
| GET | `/` | ✅ | List all complaints (runs the SLA escalation sweep first) |
| GET | `/locations` | ✅ | Lightweight lat/lng/severity feed for the heatmap |
| PUT | `/:id/vote` | ✅ | Upvote or downvote a complaint |
| PUT | `/:id/complete` | ✅ Staff | Mark resolved, with proof-of-resolution photo + remark |

### `/api/admin`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | ✅ Admin | Aggregate stats, category/status/timeline data |
| GET | `/complaints` | ✅ Admin | List complaints (admin view) |
| GET | `/complaints/:id` | ✅ Admin | Single complaint detail |
| GET | `/complaints/export` | ✅ Admin | Export complaints to CSV |
| PUT | `/complaints/:id` | ✅ Admin | Update complaint status |
| PUT | `/assign/:id` | ✅ Admin | Assign or reassign staff (recorded in assignment history) |
| DELETE | `/complaints/:id` | ✅ Admin | Delete a complaint |
| GET | `/users` | ✅ Admin | List users (with complaint counts) |
| PUT | `/users/:id/role` | ✅ Admin | Change a user's role |
| PUT | `/users/:id/block` | ✅ Admin | Block / unblock a user |
| DELETE | `/users/:id` | ✅ Admin | Delete a user |
| GET | `/notifications` | ✅ | List notifications for the current user |
| PUT | `/notifications/:id/read` | ✅ | Mark one notification read |
| PUT | `/notifications/read-all` | ✅ | Mark all notifications read |
| DELETE | `/notifications` | ✅ | Clear all notifications |

---

## Complaint Lifecycle

```
pending → assigned → in-progress → resolved
                                  ↘ rejected
```

Independently of `status`, every complaint gets a `slaDeadline` (48 hours from creation). On every complaint fetch, `applyEscalation()` checks active complaints (`pending`/`assigned`/`in-progress`) past their deadline, flips `escalated: true`, and notifies all admins in real time — no manual intervention required.

---

## Getting Started

### Clone
```bash
git clone <repository-url>
cd CiviTrack
```

### Backend setup
```bash
cd server
npm install
npm run dev   # nodemon on server.js
```

Create `server/.env`:

| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `GEMINI_API_KEY` | Google Gemini API key (image classification) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (server-side token verification) |

### Frontend setup
```bash
cd client
npm install
npm run dev   # Vite dev server
```

Create `client/.env`:

| Variable | Purpose |
|---|---|
| `VITE_GEOAPIFY_API_KEY` | Address autocomplete on the complaint form |
| `VITE_GOOGLE_CLIENT_ID` | Google Sign-In button |

---

## Roadmap / Current Limitations

- Vote endpoint doesn't yet dedupe per user — the schema has a `votedUsers` field reserved for this, not yet enforced
- No mobile app version
- No predictive analytics for city planning (long-term goal)

---

## Contributing

Contributions are welcome — fork the repo and submit a PR.

## License

No license file is currently published in this repository.

## Author

**Vighnesh Dharmale**

# iTrack BA

iTrack BA is a full-stack business-administration and audit-tracking system. It helps an
audit/inspection organization manage its clients, factories, programs, auditors and the
full audit lifecycle — from sales-person input and coordinator scheduling through report
review, invoicing and a set of analytical dashboards.

The project is split into two parts:

- **Frontend** — a React (Create React App) single-page application that lives in `src/`.
- **Backend** — a PHP REST API backed by MySQL that lives in `backend/`.

Both are designed to run together under a local XAMPP installation.

---

## Tech Stack

**Frontend**

- React 16 + React Router 5
- Material-UI v4 and Reactstrap (Bootstrap) for UI
- React Tabulator for data grids and `xlsx` / `xlsx-js-style` / `file-saver` for Excel export
- Highcharts for dashboards and charts
- Axios for API calls, `react-hook-form` for forms, SweetAlert for dialogs
- Sass (`node-sass`) for styling

**Backend**

- PHP REST API (`backend/source/api`) with JWT-based authentication
- MySQL database (managed via phpMyAdmin under XAMPP)
- PhpSpreadsheet, TCPDF and FPDI for Excel/PDF report generation (`backend/report`)
- PHPMailer for transactional email

---

## Features

- **Master data management:** business lines, buyers, programs & program categories,
  factories & factory groups, audit stages, lead/revenue types, designations, departments,
  offices, zones, states, invoice types and more.
- **People & access control:** members, auditors, user entry, user roles and
  role-to-menu permission management.
- **Audit workflow:** salesperson input, coordinator input (team/auditor assignment and
  file uploads), report reviewer, invoicing and an audit calendar.
- **Targets & HR:** member targets, program-category targets, holidays and leave.
- **Dashboards & reports:** sales dashboard, sales-achievement dashboard, program-category
  achievement dashboard, report-review dashboard, program-and-buyer-wise TAT,
  program-wise revenue status, salesperson input report and TAT-missing report.
- **System tools:** audit log, error log and user profile management.

---

## Project Structure

```
itrack-ba/
├── public/                 # CRA static assets and index.html
├── src/                    # React frontend
│   ├── index.js            # App entry point and route definitions
│   ├── views/screens/      # One folder per feature screen (CRUD + modals)
│   ├── components/          # Reusable UI (tables, navbars, headers, controls)
│   ├── services/            # API helpers, constants, notifications, loaders
│   ├── context/             # React context (user info)
│   └── assets/              # SCSS/CSS, JS helpers, images
├── backend/                # PHP REST API
│   ├── env.php             # Database & site configuration
│   ├── source/
│   │   ├── api/api_pages/  # API endpoints (one file per resource)
│   │   ├── middlewares/    # Auth middleware
│   │   └── jwt/            # JWT library
│   └── report/             # PhpSpreadsheet, TCPDF, FPDI report libraries
├── package.json
└── .env                    # Frontend environment variables
```

---

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache + PHP + MySQL/phpMyAdmin)
- [Node.js](https://nodejs.org/) (with npm)

---

## Getting Started

### 1. Clone into the XAMPP web root

Place the project in your XAMPP `htdocs` directory so the backend is served by Apache, e.g.:

```
C:\xampp\htdocs\itrack-ba
```

### 2. Set up the database

1. Start **Apache** and **MySQL** from the XAMPP control panel.
2. Open phpMyAdmin and create a database named `itrack_ba_db1`.
3. Import the project's SQL dump into that database.

### 3. Configure the backend

Edit `backend/env.php` with your local database credentials and site settings:

```php
define("DB_NAME", "itrack_ba_db1");
define("DB_USER", "root");
define("DB_PASSWORD", "");
define("DB_SERVER", "localhost");
```

The backend API is then available at `http://localhost/itrack-ba/backend/`.

### 4. Configure the frontend

The frontend reads its configuration from `.env` in the project root:

```env
REACT_APP_BASE_NAME=
REACT_APP_API_URL=http://localhost/itrack-ba/backend/
REACT_APP_FRONT_URL=http://localhost/itrack-ba/
```

Update `REACT_APP_API_URL` / `REACT_APP_FRONT_URL` if your install path differs.

### 5. Install dependencies and run

```bash
npm install
npm start
```

The development server runs at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Run the app in development mode. |
| `npm run build` | Build the production bundle into `build/`. |
| `npm test` | Run the test runner. |
| `npm run compile-sass` | Compile the main SCSS to CSS. |
| `npm run minify-sass` | Compile and minify the main SCSS. |
| `npm run install:clean` | Remove `node_modules`/lockfile, reinstall and start. |

---

## Building for Production

```bash
npm run build
```

This produces an optimized static build in the `build/` directory, which can be deployed
behind Apache alongside the PHP backend.

---

## Authentication

The API uses JWT tokens. The frontend stores the auth token and attaches it to API
requests; backend routes are protected by the `Auth` middleware in
`backend/source/middlewares`.

# Shoe Survey

A simple React + TypeScript + Vite web app for collecting shoe details at a sailing/yacht club event, with a small Node/Express backend for storage.

## Features

- Mobile-first survey UI at `/`
- Product preview image from `/public/product.jpg`
- Required fields:
  - Shoe sizing system + size
  - Country
  - Consent checkbox
- Optional fields:
  - Sail number (validated if provided)
  - Home yacht club (validated if provided)
- Country prefill attempt based on browser locale (`navigator.language` and `Intl.DateTimeFormat().resolvedOptions().locale`)
- Admin view at `/admin` with password gate (`admin123`)
- Admin submissions table + CSV export button
- Backend endpoints:
  - `POST /api/submit`
  - `GET /api/submissions`
- File persistence to `data/submissions.json`

## Project structure

- `src/` – React frontend
- `server/` – Express API + server-side validation
- `data/submissions.json` – Stored submission records
- `public/product.jpg` – Product image placeholder

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your product image:

   - Place the image at: `public/product.jpg`

## Run the app

Run frontend + backend together:

```bash
npm run dev
```

- Frontend (Vite): `http://localhost:5173`
- Backend (Express): `http://localhost:3001`

## Build frontend

```bash
npm run build
```

## Backend endpoints

- `POST /api/submit` accepts JSON body:
  - `timestamp` (ISO string)
  - `sizeSystem` (`US Men` | `US Women` | `EU` | `UK`)
  - `shoeSize` (string)
  - `country` (string)
  - `sailNumber` (optional)
  - `homeYachtClub` (optional)
  - `consent` (boolean; must be true)

- `GET /api/submissions` returns all stored submissions.

## Admin login

- Open `/admin`
- Password is hardcoded to:

  ```txt
  admin123
  ```

After login, the admin can review submissions and download all entries as CSV.

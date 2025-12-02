# WeTalk Frontend

Single-page blog application powered by React, Vite, Tailwind CSS, Redux Toolkit, React Query, and React Hook Form. The UI talks to the existing Express/TypeScript backend at `http://localhost:5080/api` for authentication, profile management, and CRUD post workflows.

## Features

- Public feed of all posts with loading + error states
- Authentication (register, login, logout) backed by HTTP-only JWT cookie
- Protected routes for profile, post creation, and editing
- React Query data management for profile/post data, including cache invalidation
- Client-side image uploads to Cloudinary and persistence of returned URLs only
- Responsive Tailwind UI with contextual buttons based on auth state

## Getting Started

```bash
cd frontend
pnpm install          # make sure axios + tailwind dependencies are installed
pnpm dev              # runs the Vite dev server
pnpm build            # type check + production bundle
```

> **Note:** The backend must be running on `http://localhost:5080` with CORS configured for credentials in order for login and cookie-based session handling to work locally.

## Environment Variables

Create a `.env` file in the `frontend` directory with your Cloudinary details:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_upload_preset
```

Both values are required for client-side uploads; configure an unsigned preset in Cloudinary that allows image uploads.

## Folder Highlights

- `src/api` – Axios clients and request helpers
- `src/store` – Redux Toolkit store + auth slice
- `src/components` – Navbar, layout, protected route, reusable UI
- `src/pages` – Route-level screens (Home, Auth, Profile, Post CRUD)
- `src/hooks` – Custom hooks for typed Redux access, auth redirects, and Cloudinary uploads

## Testing & Linting

The project inherits the default Vite + ESLint setup. Run `pnpm lint` to validate code style once dependencies are installed.

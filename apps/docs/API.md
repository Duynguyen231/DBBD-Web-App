# API Reference

Complete reference for all REST endpoints in the Đường Bộ Bình Định API.

**Base URL**: `http://localhost:4000`  
**Swagger UI**: `http://localhost:4000/api/docs`  
**Auth**: Bearer JWT token in `Authorization` header

---

## Authentication

### Login
```
POST /auth/login
```
| Field    | Type   | Required |
| -------- | ------ | -------- |
| email    | string | ✅       |
| password | string | ✅       |

**Response**: `{access_token: string, user: {id, email, name, role}}`

Default admin: `admin@duongbo.com` / `Admin@123456`

### Get Profile
```
GET /auth/profile  🔒
```
**Response**: `{id, email, name, role, createdAt}`

---

## News

### List News (Public)
```
GET /news?page=1&limit=12&categoryId=1&search=keyword
```
**Response**: `{data: News[], total, page, limit, totalPages}`

### Get News by Slug (Public)
```
GET /news/:slug
```

### List Categories (Public)
```
GET /news/categories
```
**Response**: `NewsCategory[]`

### Create News 🔒
```
POST /news
```
| Field      | Type    | Required |
| ---------- | ------- | -------- |
| titleVi    | string  | ✅       |
| titleEn    | string  | ✅       |
| excerptVi  | string  | ✅       |
| excerptEn  | string  | ✅       |
| contentVi  | string  | ✅       |
| contentEn  | string  | ✅       |
| thumbnail  | string  | ❌       |
| categoryId | number  | ❌       |

### Update News 🔒
```
PUT /news/:id
```
Partial update — same fields as create, all optional.

### Delete News 🔒
```
DELETE /news/:id
```

### Category CRUD 🔒
```
POST   /news/categories          {nameVi, nameEn}
PUT    /news/categories/:id      {nameVi?, nameEn?}
DELETE /news/categories/:id
```

---

## Projects

### List Projects (Public)
```
GET /projects?page=1&limit=12&status=ONGOING&search=keyword
```
**Status values**: `ONGOING`, `COMPLETED`, `UPCOMING`

### Get Project by Slug (Public)
```
GET /projects/:slug
```

### Create Project 🔒
```
POST /projects
```
| Field     | Type     | Required |
| --------- | -------- | -------- |
| titleVi   | string   | ✅       |
| titleEn   | string   | ✅       |
| descVi    | string   | ✅       |
| descEn    | string   | ✅       |
| location  | string   | ✅       |
| status    | enum     | ❌ (default: ONGOING) |
| images    | string[] | ❌       |
| startDate | datetime | ❌       |
| endDate   | datetime | ❌       |

### Update / Delete 🔒
```
PUT    /projects/:id
DELETE /projects/:id
```

---

## Services

### List Services (Public)
```
GET /services
```
**Response**: `Service[]` (ordered by `order` ASC)

### Create Service 🔒
```
POST /services
```
| Field   | Type   | Required |
| ------- | ------ | -------- |
| titleVi | string | ✅       |
| titleEn | string | ✅       |
| descVi  | string | ✅       |
| descEn  | string | ✅       |
| icon    | string | ❌       |
| image   | string | ❌       |
| order   | number | ❌ (default: 0) |

### Update / Delete 🔒
```
PUT    /services/:id
DELETE /services/:id
```

---

## Products

### List Products (Public)
```
GET /products?page=1&limit=12&category=Nhựa%20đường&search=keyword
```

### Get Product by Slug (Public)
```
GET /products/:slug
```

### Create Product 🔒
```
POST /products
```
| Field   | Type     | Required |
| ------- | -------- | -------- |
| titleVi | string   | ✅       |
| titleEn | string   | ✅       |
| descVi  | string   | ✅       |
| descEn  | string   | ✅       |
| images  | string[] | ❌       |
| category| string   | ❌       |

### Update / Delete 🔒
```
PUT    /products/:id
DELETE /products/:id
```

---

## Jobs (Recruitment)

### List Jobs (Public)
```
GET /jobs?page=1&limit=10&status=OPEN
```
**Status values**: `OPEN`, `CLOSED`

### Get Job by Slug (Public)
```
GET /jobs/:slug
```

### Create Job 🔒
```
POST /jobs
```
| Field          | Type     | Required |
| -------------- | -------- | -------- |
| titleVi        | string   | ✅       |
| titleEn        | string   | ✅       |
| descVi         | string   | ✅       |
| descEn         | string   | ✅       |
| requirementsVi | string   | ✅       |
| requirementsEn | string   | ✅       |
| location       | string   | ✅       |
| deadline       | datetime | ❌       |
| status         | enum     | ❌ (default: OPEN) |

### Update / Delete 🔒
```
PUT    /jobs/:id
DELETE /jobs/:id
```

---

## Banners

### List Banners (Public)
```
GET /banners?page=home
```
**Response**: `Banner[]` (filtered by page, ordered by `order` ASC)

### Create Banner 🔒
```
POST /banners
```
| Field   | Type   | Required |
| ------- | ------ | -------- |
| image   | string | ✅       |
| titleVi | string | ❌       |
| titleEn | string | ❌       |
| link    | string | ❌       |
| order   | number | ❌ (default: 0) |
| page    | string | ❌ (default: "home") |

### Update / Delete 🔒
```
PUT    /banners/:id
DELETE /banners/:id
```

---

## Partners

### List Partners (Public)
```
GET /partners
```
**Response**: `Partner[]` (ordered by `order` ASC)

### Create Partner 🔒
```
POST /partners
```
| Field   | Type   | Required |
| ------- | ------ | -------- |
| name    | string | ✅       |
| logo    | string | ✅       |
| website | string | ❌       |
| order   | number | ❌ (default: 0) |

### Update / Delete 🔒
```
PUT    /partners/:id
DELETE /partners/:id
```

---

## Contact Submissions

### Submit Contact Form (Public)
```
POST /contact
```
| Field   | Type   | Required |
| ------- | ------ | -------- |
| name    | string | ✅       |
| email   | string | ✅       |
| phone   | string | ❌       |
| subject | string | ✅       |
| message | string | ✅       |

### List Submissions 🔒
```
GET /contact
```

### Mark as Read 🔒
```
PUT /contact/:id/read
```

### Delete 🔒
```
DELETE /contact/:id
```

---

## Media (File Upload)

### Upload File 🔒
```
POST /media/upload
Content-Type: multipart/form-data
```
| Field | Type | Required | Notes                                   |
| ----- | ---- | -------- | --------------------------------------- |
| file  | file | ✅       | Max 10MB. jpg/png/gif/webp/svg/pdf      |

**Response**: `{id, filename, url, mimeType, size, createdAt}`

The `url` field (e.g. `/uploads/uuid.jpg`) is used when creating content.

### List Files 🔒
```
GET /media
```

### Delete File 🔒
```
DELETE /media/:id
```

---

## Settings

### Get All Settings (Public)
```
GET /settings
```
**Response**: `{key1: "value1", key2: "value2", ...}`

### Upsert Settings 🔒
```
POST /settings
```
**Body**: `{key1: "value1", key2: "value2", ...}`

Creates or updates each key-value pair.

---

## Database Models

### Enums
```
UserRole:      ADMIN | SUPER_ADMIN
ProjectStatus: ONGOING | COMPLETED | UPCOMING
JobStatus:     OPEN | CLOSED
```

### Common Patterns
- **Slugs**: Auto-generated from `titleVi` using `slugify` (Vietnamese-aware)
- **Pagination**: `{data: T[], total, page, limit, totalPages}`
- **Images**: Stored as URL strings (e.g. `/uploads/uuid.jpg`)
- **Image arrays**: `string[]` stored as JSON (products, projects)
- **Ordering**: Models with `order` field sorted ASC
- **Bilingual**: Most content has `Vi` and `En` suffix fields
- **Timestamps**: `createdAt` (auto), `updatedAt` (auto on change)

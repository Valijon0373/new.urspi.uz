# Frontend: Menu → Category → SubCategory → Info → Material

Bu hujjat sayt menyusi va “UrDPI ilmiy jurnallari” kabi sahifalar uchun backend API ni frontend dasturchiga topshirish uchun yozilgan.

**Base URL (prod):** `https://<api-host>` (masalan nginx orqali)  
**Swagger:** `https://<api-host>/swagger-ui.html`  
**Landing API:** token **kerak emas** (`/api/landing/**`)

---

## 1. Ma’lumot modeli (UI oqimi)

```
Menu (masalan: Faoliyat)
 └── Category (Ilmiy innovatsion faoliyat)
      └── SubCategory (UrDPI ilmiy jurnallari)
           ├── contentType = TABLE | FEED | LINK
           └── Info (jadval qatori / yangilik kartasi)
                └── Material (yil + fayl/son)
```

### Misol: Ilmiy jurnallar

1. SubCategory ochiladi → **jadval** (№, Sahifa nomi, Ko‘rish).
2. **Ko‘rish** → Info detail + `years[]` (2026, 2025, 2024…).
3. Yil tanlanadi → shu yil **materiallari** (son/PDF).

### `contentType`

| Qiymat | Frontend ko‘rinishi |
|--------|---------------------|
| `TABLE` | Jadval; `infos` createdAt DESC (oxirgi birinchi) |
| `FEED` | Yangilik/e’lon kartalari; `title`, `content`, `photoLink` |
| `LINK` | `infos` bo‘sh; `linkPath` / `linkTargetType` bo‘yicha boshqa sahifaga yo‘naltirish |

---

## 2. Landing endpointlar (public)

Barcha so‘rovlarda `lang` ixtiyoriy: `uz` | `ru` | `en` (default `uz`).

### 2.1 Menyular

```http
GET /api/landing/menus?lang=uz
```

**Response `data[]`:**
```json
{ "id": 1, "name": "Faoliyat", "slug": "faoliyat", "sortOrder": 1 }
```

### 2.2 Category lar

```http
GET /api/landing/menus/{menuId}/categories?lang=uz
```

```json
{ "id": 1, "menuId": 1, "name": "Ilmiy innovatsion faoliyat", "slug": "ilmiy-innovatsion", "sortOrder": 1 }
```

### 2.3 SubCategory lar

```http
GET /api/landing/categories/{categoryId}/subcategories?lang=uz
```

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "UrDPI ilmiy jurnallari",
  "slug": "urdpi-jurnallar",
  "contentType": "TABLE",
  "tableColumns": "[\"№\",\"Sahifa nomi\",\"Ko'rish\"]",
  "linkPath": null,
  "linkTargetType": null,
  "sortOrder": 1
}
```

```http
GET /api/landing/subcategories/{id}?lang=uz
```

### 2.4 Infos (jadval / feed)

```http
GET /api/landing/subcategories/{id}/infos?lang=uz&page=0&size=20
```

**`TABLE` / `FEED`:**
```json
{
  "subCategory": { "...": "..." },
  "contentType": "TABLE",
  "linkPath": null,
  "linkTargetType": null,
  "infos": [
    {
      "id": 1,
      "subCategoryId": 1,
      "title": "Axborotnoma",
      "content": null,
      "photoLink": null,
      "publishedAt": null,
      "sortOrder": 0,
      "createdAt": "2026-10-21T10:47:45",
      "years": null
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 20
}
```

**`LINK`:**
```json
{
  "contentType": "LINK",
  "linkPath": "/documents",
  "linkTargetType": "DOCUMENT",
  "infos": [],
  "totalElements": 0
}
```

Jadvalda tartib: **oxirgi qo‘shilgan yuqorida** (`createdAt` DESC).  
№ ustuni: `page * size + index + 1`.

### 2.5 Info detail + yillar

```http
GET /api/landing/infos/{id}?lang=uz
```

```json
{
  "id": 1,
  "title": "Axborotnoma",
  "content": null,
  "photoLink": null,
  "years": [2025, 2024]
}
```

`years` — **DESC** (eng yangi yil birinchi).

### 2.6 Materiallar (yil kesimi)

```http
GET /api/landing/infos/{id}/materials?year=2025&lang=uz&page=0&size=20
```

`year` ixtiyoriy; berilmasa barcha yillar.

```json
{
  "content": [
    {
      "id": 1,
      "infoId": 1,
      "year": 2025,
      "title": "2025-1 son",
      "fileLink": "/api/files/...",
      "coverLink": null,
      "publishedAt": null,
      "createdAt": "..."
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

Fayl ochish: `fileLink` / `photoLink` / `coverLink` odatda relative path — to‘liq URL: `{API_BASE}{fileLink}` yoki loyihadagi files endpoint qoidasiga qarab.

---

## 3. Frontend sahifa routing (tavsiya)

| Sahifa | API |
|--------|-----|
| Menyudan Category list | `menus` → `menus/{id}/categories` |
| SubCategory list | `categories/{id}/subcategories` |
| Jadval / Feed | `subcategories/{id}/infos` |
| Jurnal (Ko‘rish) | `infos/{id}` → `years` chiplari |
| Yil ichidagi sonlar | `infos/{id}/materials?year=2025` |
| LINK SubCategory | `window.location` yoki router → `linkPath` |

Breadcrumb misol: `Asosiy / UrDPI ilmiy jurnallari / Axborotnoma / 2025`

---

## 4. Admin (faqat CMS / ichki panel)

Token kerak. Permission lar: `MENU_*`, `MENU_CATEGORY_*`, `MENU_SUBCATEGORY_*`, `MENU_INFO_*`, `MENU_MATERIAL_*`.

| Method | Path |
|--------|------|
| CRUD | `/api/menus` |
| CRUD | `/api/menu-categories?menuId=` |
| CRUD | `/api/menu-subcategories?categoryId=` |
| multipart CRUD | `/api/menu-infos` |
| multipart CRUD | `/api/menu-materials` |

Info/Material create: `multipart/form-data` (`photo`, `file`, `cover` ixtiyoriy).

---

## 5. Cursor / AI uchun prompt (frontend)

Quyidagi matnni frontend loyihasida Cursor Agent ga bering:

```text
Backend (URSPI new API) da Menu ierarxiyasi bor. Public landing endpointlardan foydalanib UI yasagin.

Ierarxiya: Menu → Category → SubCategory → Info → Material(year).

SubCategory.contentType:
- TABLE: jadval (№, title, Ko'rish). Infos createdAt DESC.
- FEED: yangilik kartalari (title, content, photoLink, publishedAt).
- LINK: infos bo'sh, linkPath ga yo'naltir.

Oqim (jurnallar):
1) GET /api/landing/subcategories/{id}/infos?lang=uz — jadval
2) Ko'rish → GET /api/landing/infos/{id} — years[] DESC
3) Yil → GET /api/landing/infos/{id}/materials?year=YYYY — materiallar

lang: uz|ru|en. Token landing uchun kerak emas.
API base: VITE_API_URL (yoki env). fileLink/photoLink ni API base bilan birlashtir.
Pageable: page, size. Sort yuborma (backend o'zi tartiblaydi).
UI: breadcrumb, TABLE uchun oddiy jadval, years uchun chip/tab, materialda title + Ko'rish (fileLink).
Hujjat: docs/FRONTEND_MENU_API.md
```

---

## 6. Tezkor tekshiruv (curl)

```bash
curl -s "https://<api-host>/api/landing/menus?lang=uz"
curl -s "https://<api-host>/api/landing/subcategories/1/infos?lang=uz"
curl -s "https://<api-host>/api/landing/infos/1?lang=uz"
curl -s "https://<api-host>/api/landing/infos/1/materials?year=2025&lang=uz"
```

---

## 7. Qo‘shimcha: HEMIS student statistika (ixtiyoriy)

```http
GET /api/hemis/public/stat-student?l=uz-UZ
```

Token kerak emas. Aktiv HEMIS config `baseUrl` bo‘lishi shart (admin `/api/hemis-configs`).

---

## 8. Javob o‘rami

Ko‘p endpointlar:

```json
{ "message": "...", "data": { } }
```

Xato:

```json
{ "status": 404, "error": "Not Found", "message": "...", "path": "..." }
```


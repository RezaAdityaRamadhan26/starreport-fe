# StarReport Frontend — UI Redesign

## 📋 Ringkasan Perubahan

Redesign menyeluruh seluruh halaman frontend StarReport agar memiliki design language yang konsisten, modern, dan premium. Semua logic backend (API calls, authentication, state management) **tidak diubah sama sekali**.

---

## 🎨 Design System yang Digunakan

| Teknologi | Keterangan |
|---|---|
| **Next.js 16** | Framework React dengan App Router |
| **Framer Motion** | Animasi entrance (fade-in, slide) pada halaman auth |
| **Vanilla CSS** | Custom design system dengan prefix `landing-*`, `auth-*`, `ft-*`, `ds-*` |
| **Lucide React** | Icon library |
| **CSS Custom Properties** | `--foreground`, `--background`, `--card`, `--border`, `--muted` untuk dark/light mode |
| **color-mix()** | CSS modern untuk transparansi dinamis tanpa hardcode rgba |

---

## 📁 File yang Diubah (18 files)

### Landing Page
| File | Perubahan |
|---|---|
| `src/app/page.tsx` | Full redesign: parallax hero, organic blobs, interactive feature showcase, animated stats |
| `src/app/globals.css` | +2800 baris CSS: `landing-*`, `ft-*`, `auth-*`, `ds-*` design system |

### Halaman Auth (Login / Register)
| File | Perubahan |
|---|---|
| `src/app/login/page.tsx` | Split-panel layout: visual branding (kiri) + form (kanan), Framer Motion animations |
| `src/app/register/page.tsx` | Sama dengan login + password strength indicator + confirm match feedback |

### Dashboard Layout & Navigation
| File | Perubahan |
|---|---|
| `src/app/dashboard/layout.tsx` | Semantic `ds-layout` / `ds-layout-user` classes |
| `src/components/Sidebar.tsx` | `ds-sidebar-*` classes, gradient brand icon, smooth collapse animation |
| `src/components/Navbar.tsx` | `ds-topbar-*` classes, glassmorphism backdrop, mobile hamburger menu |

### Dashboard Pages
| File | Perubahan |
|---|---|
| `src/app/dashboard/page.tsx` | `ds-stat-card` dengan hover lift, gradient stat icons |
| `src/app/dashboard/reports/page.tsx` | `ds-filter-bar`, `ds-search-input`, `ds-select`, `ds-pagination` |
| `src/app/dashboard/reports/create/page.tsx` | `ds-steps` indicator, `ds-dropzone`, `ds-review` card |
| `src/app/dashboard/reports/[id]/page.tsx` | `ds-card`, `ds-comment` bubble chat, `ds-badge` status |
| `src/app/dashboard/my-reports/page.tsx` | `ds-empty` state, consistent card grid |
| `src/app/dashboard/maps/page.tsx` | `ds-card` map container |
| `src/app/dashboard/settings/page.tsx` | `ds-avatar-lg`, `ds-upload-btn`, reused `auth-input` for forms |
| `src/app/dashboard/users/page.tsx` | `ds-table-wrap`, `ds-table`, `ds-role-toggle` |

### Shared Components
| File | Perubahan |
|---|---|
| `src/components/ReportCard.tsx` | `ds-report-card` dengan hover lift + image zoom + meta border |
| `src/components/StatusBadge.tsx` | `ds-badge-*` classes dengan dark mode support |
| `src/components/ConfirmModal.tsx` | `ds-modal-*` classes dengan backdrop blur |

---

## ✨ Fitur Design Baru

- **Split-panel auth layout** — Visual branding kiri + form kanan (responsive: visual panel hidden di mobile)
- **Mesh gradient backgrounds** — Radial gradients organik, bukan flat solid colors
- **Organic blob shapes** — Floating animated blobs pada auth pages
- **Glassmorphism navbar** — `backdrop-filter: blur(16px)` pada user navbar
- **Hover micro-interactions** — Card lift, image zoom, button translate, link gap animation
- **Password strength bar** — Animated progress bar (merah → kuning → hijau) pada register
- **Dark mode support** — Semua komponen mendukung `.dark` class toggle
- **Mobile responsive** — Hamburger menu, hidden visual panels, stacked grids
- **Consistent typography** — `font-weight: 800` headings, `-0.03em` letter-spacing, `0.8125rem` body text

---

## 🔒 Yang TIDAK Diubah

- Semua API service calls (`authService`, `reportService`, `commentService`, `categoryService`, `userService`)
- State management (Zustand `authStore`)
- Routing dan protected routes
- Form validation logic
- Toast notifications
- Map components (`MapComponent`, `MapPicker`)
- TypeScript types dan interfaces

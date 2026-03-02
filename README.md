# Angular Enterprise Dashboard

> A production-grade admin dashboard built with Angular 18, NgRx Signal Store, and Material Design 3 — featuring real-time KPI metrics, interactive charts, user management with CRUD operations, and a fully responsive dark/light theme system.

[![Angular](https://img.shields.io/badge/Angular-18.2-dd0031?style=flat-square&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![NgRx](https://img.shields.io/badge/NgRx_Signal_Store-18.1-ba2bd2?style=flat-square&logo=ngrx)](https://ngrx.io/guide/signals)
[![Material](https://img.shields.io/badge/Material_Design_3-18.2-757575?style=flat-square&logo=material-design)](https://material.angular.io/)
[![Test Coverage](https://img.shields.io/badge/Coverage-95%25-brightgreen?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<!-- [Live Demo](https://angular-dashboard.vercel.app) -->

## Screenshots

| Dashboard | User Management |
|-----------|----------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Users](docs/screenshots/users.png) |

| Analytics | Settings (Dark Mode) |
|-----------|---------------------|
| ![Analytics](docs/screenshots/analytics.png) | ![Settings](docs/screenshots/settings-dark.png) |

> Screenshots coming after deployment. Run locally to preview.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Angular 18.2 with Signals & Standalone Components |
| **State Management** | NgRx Signal Store with computed selectors |
| **UI Library** | Angular Material with Material Design 3 theming |
| **Charts** | Chart.js via ng2-charts (line, bar, doughnut) |
| **Forms** | Reactive Forms with custom validators |
| **Styling** | SCSS with M3 CSS custom properties |
| **Testing** | Jest with 95%+ coverage |
| **Package Manager** | PNPM |

## Architecture

```mermaid
graph TB
    subgraph Router["App Router (Lazy Loading)"]
        direction LR
        AuthRoutes["Auth Routes<br/><small>guest only</small>"]
        ProtectedRoutes["Protected Routes<br/><small>auth guard</small>"]
    end

    subgraph Layout["Layout Shell"]
        Header["Header<br/><small>theme toggle, profile menu</small>"]
        Sidebar["Sidebar<br/><small>collapsible navigation</small>"]
        Breadcrumbs["Breadcrumbs"]
    end

    subgraph Features["Lazy-Loaded Features"]
        Auth["Auth<br/><small>Login / Register</small>"]
        Dashboard["Dashboard<br/><small>KPI cards, 3 charts, activity feed</small>"]
        Users["Users<br/><small>data table, CRUD, filters, bulk actions</small>"]
        Orders["Orders<br/><small>data table, status management</small>"]
        Analytics["Analytics<br/><small>traffic, channels, devices</small>"]
        Settings["Settings<br/><small>profile, notifications, appearance</small>"]
    end

    subgraph Stores["NgRx Signal Stores"]
        DashStore["DashboardStore"]
        UsersStore["UsersStore"]
        OrdersStore["OrdersStore"]
        AnalyticsStore["AnalyticsStore"]
    end

    subgraph Core["Core Services"]
        AuthSvc["AuthService<br/><small>JWT mock auth</small>"]
        ThemeSvc["ThemeService<br/><small>dark/light mode</small>"]
        Interceptor["Auth Interceptor<br/><small>token injection</small>"]
        Guards["Guards<br/><small>auth + guest</small>"]
    end

    AuthRoutes --> Auth
    ProtectedRoutes --> Layout --> Features
    Dashboard --> DashStore
    Users --> UsersStore
    Orders --> OrdersStore
    Analytics --> AnalyticsStore
    Features --> Core
```

## Features

- **Authentication** — Login/register with JWT mock flow, route guards, HTTP interceptor, demo credentials
- **Dashboard** — 4 KPI cards with trend indicators, revenue line chart, category bar chart, distribution doughnut chart, recent activity feed
- **User Management** — Sortable/paginated data table, search with debounce, role/status filters, create/edit/delete dialogs, bulk selection
- **Orders** — Order tracking table with status management, filtering, pagination, and revenue totals
- **Analytics** — Traffic trends, channel breakdown (horizontal bar), device distribution, session KPIs with formatted values
- **Settings** — Profile form with validation, notification preferences, appearance/theme toggle
- **Theming** — Material Design 3 light/dark mode with CSS custom properties, system preference detection, localStorage persistence
- **Responsive Layout** — Collapsible sidebar, mobile-friendly hamburger menu, adaptive grid layouts

## Getting Started

### Prerequisites

- Node.js 20+ (via [NVM](https://github.com/nvm-sh/nvm))
- PNPM 9+ (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/jayampathiw/angular-dashboard.git
cd angular-dashboard
pnpm install
```

### Development

```bash
pnpm start          # Dev server at http://localhost:4200
pnpm test           # Run unit tests
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Coverage report
pnpm build          # Production build
```

### Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@demo.com` |
| Password | `password` |

## Testing

```bash
pnpm test              # 363 tests across 42 suites
pnpm test:coverage     # Full coverage report
```

| Metric | Coverage |
|--------|----------|
| Statements | 95.91% |
| Branches | 84.54% |
| Functions | 93.06% |
| Lines | 95.84% |

All NgRx Signal Stores, services, guards, interceptors, resolvers, and components are covered.

## Project Structure

```
src/app/
├── core/                           # Singletons — instantiated once
│   ├── auth/                       # AuthService, auth guard, interceptor
│   ├── models/                     # TypeScript interfaces (User, Auth, Nav)
│   └── services/                   # ThemeService, SidebarService, BreadcrumbService
│
├── features/                       # Lazy-loaded feature routes
│   ├── auth/                       # Login & Register pages
│   ├── dashboard/                  # KPI cards, charts, activity feed
│   │   ├── components/             # KpiCard, RevenueChart, CategoryChart, etc.
│   │   ├── store/                  # DashboardStore (NgRx Signal Store)
│   │   └── data/                   # Mock data
│   ├── users/                      # User management with CRUD
│   │   ├── components/             # UserTable, UserFilters, UserDialog
│   │   └── store/                  # UsersStore (pagination, sorting, filtering)
│   ├── orders/                     # Order tracking
│   ├── analytics/                  # Traffic, channels, devices
│   └── settings/                   # Profile, notifications, appearance
│
└── shared/                         # Reusable across features
    └── components/                 # Layout, Header, Sidebar, Footer, Breadcrumbs
```

## Key Patterns Demonstrated

- **Signals & Computed State** — All local component state uses `signal()` and `computed()` for fine-grained reactivity without RxJS overhead
- **NgRx Signal Store** — Feature-level stores with `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, and `patchState()` for immutable updates
- **Standalone Components** — Zero NgModules — every component declares its own imports
- **OnPush Change Detection** — Every component uses `ChangeDetectionStrategy.OnPush` for optimal performance
- **Functional Guards & Resolvers** — `CanActivateFn` and `ResolveFn<T>` — no class-based guards
- **Functional HTTP Interceptor** — `HttpInterceptorFn` for token injection
- **Signal Inputs/Outputs** — `input()`, `input.required()`, `output()` — no decorators
- **New Control Flow** — `@if`, `@for`, `@switch` — no legacy structural directives
- **Lazy Loading** — Route-level code splitting via `loadComponent()` and `loadChildren()`
- **inject() Function** — All dependencies injected via `inject()` — no constructor injection

## License

MIT

## Author

**Jayampathy Wijesena** — Senior Angular Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-jayampathiw.github.io-0078D4?style=flat-square)](https://jayampathiw.github.io/Portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jayampathy--wijesena-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jayampathy-wijesena)
[![GitHub](https://img.shields.io/badge/GitHub-jayampathiw-181717?style=flat-square&logo=github)](https://github.com/jayampathiw)

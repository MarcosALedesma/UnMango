<a id="top"></a>

<div align="center">



<img alt="UnMango" src="https://capsule-render.vercel.app/api?type=waving&color=0:F59E0B,100:2ECC71&height=200&section=header&text=UnMango&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Mi%20Administrador%20y%20%20Nuestros%20Gastos%20Online&descAlignY=58&descSize=18" width="100%">


<br>

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange?style=for-the-badge)](#planificacion)
[![Licencia](https://img.shields.io/badge/licencia-MIT-2ECC71?style=for-the-badge)](./LICENSE)
![Último commit](https://img.shields.io/github/last-commit/TU_USUARIO/TU_REPO?style=for-the-badge)
![Tamaño del repositorio](https://img.shields.io/github/repo-size/TU_USUARIO/TU_REPO?style=for-the-badge)

<br>

[`Características`](#caracteristicas) [`Capturas`](#capturas) [`Arquitectura`](#arquitectura) [`Modelo de datos`](#modelo-de-datos)  [`Planificación`](#planificacion) [`Tecnologías`](#tecnologias) [`Instalación`](#instalacion) 

</div>

---

**UnMango** es una aplicación web, instalable como PWA, para gestionar gastos personales y compartidos. Permite cargar gastos a mano o con un comprobante, controlar gastos fijos con recordatorios y dividir cuentas entre amigos sin hacer cálculos.

> [!NOTE]
> El proyecto está en desarrollo activo. Algunas funcionalidades todavía no están disponibles. El avance por fase se detalla en [Planificación](#planificacion).

<a id="caracteristicas"></a>
<div align="center">
  <img alt="CARACTERÍSTICAS" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=CARACTER%C3%8DSTICAS">
</div>

---

| Funcionalidad | Descripción |
|---|---|
| **Registro de gastos** | Carga manual o por comprobante: el sistema propone monto, fecha y destinatario, y el usuario confirma. |
| **Planilla y gráficas** | Categorías, búsqueda, orden, paginación y resumen visual por período. |
| **Gastos fijos** | Alquiler, servicios y suscripciones con periodicidad semanal o mensual. |
| **Recordatorios** | Avisos antes del vencimiento y diarios hasta que se marca el pago. |
| **Eventos con amigos** | Gastos compartidos con reparto equitativo, por porcentaje o por monto exacto. |
| **Simplificación de deudas** | Calcula la menor cantidad de transferencias para dejar todo saldado. |
| **PWA** | Instalable en Android y compatible con compartir comprobantes desde otras aplicaciones. |

<details>
<summary>Cómo se calcula el balance de cada persona</summary>

Para cada integrante de un evento, el balance neto es la diferencia entre lo que pagó y lo que le corresponde:

$$\text{balance}_i = \text{pagado}_i - \text{corresponde}_i$$

Un balance positivo indica que la persona tiene que recibir dinero; uno negativo, que tiene que pagar. La simplificación de deudas empareja al mayor deudor con el mayor acreedor hasta que todos los balances llegan a cero.

Todos los montos se guardan en centavos como números enteros.[^1]
</details>

[^1]: Se evita el uso de números decimales para no acumular errores de redondeo al repartir gastos.

[Volver arriba](#top)

<a id="capturas"></a>
<div align="center">
  <img alt="CAPTURAS" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=CAPTURAS">
</div>

---

<!-- Agregá tus capturas en docs/assets/ -->

<div align="center">

| Planilla de gastos | Gastos fijos | Evento con amigos |
|:---:|:---:|:---:|
| [![Planilla](docs/assets/planilla.png)](docs/assets/planilla.png) | [![Fijos](docs/assets/fijos.png)](docs/assets/fijos.png) | [![Eventos](docs/assets/eventos.png)](docs/assets/eventos.png) |

</div>

[Volver arriba](#top)

<a id="arquitectura"></a>
<div align="center">
  <img alt="ARQUITECTURA" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=ARQUITECTURA">
</div>

---

Dos capas independientes que se comunican por HTTP. El backend sigue una arquitectura en capas y expone una API REST.

```mermaid
flowchart LR
    subgraph Cliente["Frontend (Angular)"]
        UI[Componentes] --> SVC[Servicios HTTP]
    end
    subgraph Servidor["Backend (Express + TypeScript)"]
        R[Routes] --> C[Controllers] --> S[Services] --> REPO[Repositories]
        J[Jobs programados] --> S
    end
    SVC -->|HTTP / JSON| R
    REPO --> DB[(PostgreSQL)]
    S --> ST[(Almacenamiento de archivos)]
```

```
.
├── frontend/     # Aplicación Angular
├── backend/      # API REST (Express + Prisma)
│   └── src/
│       ├── modules/    # Un módulo por recurso (routes, controller, service, repository, schemas)
│       ├── common/     # Middlewares, errores y utilidades
│       ├── config/     # Configuración y variables de entorno
│       └── jobs/       # Tareas programadas
└── docs/         # Documentación técnica y diagramas
```

> [!IMPORTANT]
> El proyecto no admite `any`. Los datos externos entran como `unknown` y se validan con Zod antes de usarse.

[Volver arriba](#top)

<a id="modelo-de-datos"></a>
<div align="center">
  <img alt="MODELO DE DATOS" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=MODELO+DE+DATOS">
</div>

---

La base de datos es relacional y está normalizada hasta la tercera forma normal (3FN).



> [!TIP]
> El diagrama es un resumen. El modelo completo está en [docs/diagrama-er.md](./docs/diagrama-er.md).

[Volver arriba](#top)

<a id="planificacion"></a>
<div align="center">
  <img alt="PLANIFICACIÓN" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=PLANIFICACI%C3%93N">
</div>

---

```mermaid
gantt
    title Fases del proyecto
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Base
    Núcleo personal                  :active, f1, 2026-10-14, 21d
    section Funcionalidades
    Comprobantes                     :f2, after f1, 14d
    Gastos fijos y notificaciones    :f3, after f2, 14d
    Eventos y reparto                :f4, after f3, 21d
    section Extras
    Chat y amigos                    :f5, after f4, 14d
    Cierre y documentación           :f6, after f5, 14d
```

<div align="center">

![Diseño y modelo de datos](https://img.shields.io/badge/Dise%C3%B1o%20y%20modelo%20de%20datos-100%25-brightgreen?style=flat-square)
![Núcleo personal](https://img.shields.io/badge/N%C3%BAcleo%20personal-0%25-lightgrey?style=flat-square)
![Comprobantes](https://img.shields.io/badge/Comprobantes-0%25-lightgrey?style=flat-square)
![Gastos fijos](https://img.shields.io/badge/Gastos%20fijos-0%25-lightgrey?style=flat-square)
![Eventos](https://img.shields.io/badge/Eventos-0%25-lightgrey?style=flat-square)

</div>

[Volver arriba](#top)

<a id="tecnologias"></a>
<div align="center">
  <img alt="TECNOLOGÍAS" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=TECNOLOG%C3%8DAS">
</div>

---

<div align="center">
  <img alt="Angular, TypeScript, Node.js, Express, PostgreSQL, Prisma, Git y GitHub" src="https://skillicons.dev/icons?i=angular,ts,nodejs,express,postgres,prisma,git,github&perline=8">
</div>

<br>

| Capa | Tecnologías |
|---|---|
| **Frontend** | [Angular](https://angular.dev), Reactive Forms, [date-fns](https://date-fns.org) |
| **Backend** | [Node.js](https://nodejs.org), [Express](https://expressjs.com), [TypeScript](https://www.typescriptlang.org) (modo estricto) |
| **Base de datos** | [PostgreSQL](https://www.postgresql.org), [Prisma](https://www.prisma.io) |
| **Validación** | [Zod](https://zod.dev) |
| **Autenticación** | JWT con refresh tokens, [argon2](https://github.com/ranisalt/node-argon2) |
| **Tareas programadas** | [node-cron](https://github.com/node-cron/node-cron) |
| **Documentación de API** | [OpenAPI / Swagger](https://swagger.io) |
| **Testing** | Vitest o Jest + [Supertest](https://github.com/ladjs/supertest) |

[Volver arriba](#top)

<a id="instalacion"></a>
<div align="center">
  <img alt="INSTALACIÓN" src="https://readme-typing-svg.demolab.com?font=Orbitron&size=25&duration=2500&pause=1000&color=2ECC71&repeat=false&center=true&vCenter=true&width=600&height=35&lines=INSTALACI%C3%93N">
</div>

---

Requisitos: [Node.js](https://nodejs.org) `>= 20`, [PostgreSQL](https://www.postgresql.org/download/) `>= 15` y [Git](https://git-scm.com).

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200` y la API en `http://localhost:3000/api/v1`.

> [!TIP]
> La documentación interactiva de la API (Swagger) está en `http://localhost:3000/api/docs`.

> [!WARNING]
> Completá `backend/.env` con tus propios valores y no lo subas nunca al repositorio.

[Volver arriba](#top)

---

<div align="center">

### Autor

**TU_NOMBRE**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/TU_USUARIO)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/TU_PERFIL)

<sub>Distribuido bajo licencia [MIT](./LICENSE) · Proyecto desarrollado como Trabajo Final Integrador</sub>

<!-- PIE: usá el mismo degradé del banner que elijas -->
<img alt="" src="https://capsule-render.vercel.app/api?type=waving&color=0:0B3C49,100:2ECC71&height=100&section=footer" width="100%">

</div>

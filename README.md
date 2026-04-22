# PaluwagaChain

<p align="center">
   <img src="./PaluwagaChain_Logo.png" alt="PaluwagaChain Logo" width="340" />
</p>

[![LIVE DEMO](https://img.shields.io/badge/%E2%96%B2%20LIVE%20DEMO-0B1220?style=for-the-badge&labelColor=0B1220&color=0B1220)](https://paluwaga-chain-zarrah-valles-projects.vercel.app)
![PALUWAGA-CHAIN](https://img.shields.io/badge/PALUWAGA--CHAIN-f59e0b?style=for-the-badge&labelColor=f59e0b&color=f59e0b)
![STELLAR](https://img.shields.io/badge/%E2%9C%94%20STELLAR-4b5563?style=for-the-badge&labelColor=4b5563&color=4b5563)
![TESTNET](https://img.shields.io/badge/TESTNET-7c3aed?style=for-the-badge&labelColor=7c3aed&color=7c3aed)
![SOROBAN SDK](https://img.shields.io/badge/SOROBAN%20SDK-111827?style=for-the-badge&labelColor=111827&color=111827)
![22.0.0](https://img.shields.io/badge/22.0.0-3b82f6?style=for-the-badge&labelColor=3b82f6&color=3b82f6)
![VITE](https://img.shields.io/badge/%E2%9A%A1%20VITE-374151?style=for-the-badge&labelColor=374151&color=374151)
![5.4.21](https://img.shields.io/badge/5.4.21-6366f1?style=for-the-badge&labelColor=6366f1&color=6366f1)
![PRIVACY](https://img.shields.io/badge/PRIVACY-4b5563?style=for-the-badge&labelColor=4b5563&color=4b5563)
![NON-CUSTODIAL](https://img.shields.io/badge/NON--CUSTODIAL-2563eb?style=for-the-badge&labelColor=2563eb&color=2563eb)

**Stellar Testnet** · **Soroban** · **Vite** · **React** · **Freighter**

**PaluwagaChain** is an on-chain rotating savings dApp: groups contribute USDC each round, and a Soroban smart contract on Stellar enforces the pool, rotation, and release logic—so trust lives in the contract, not a single person.

---

## Problem

In a traditional *paluwagan*, one member collects money from everyone each period and passes the pot to the next person in the rotation. That works when everyone knows each other—but it breaks down when you need stronger guarantees: disputes over who paid, who goes next, or who holds the money can ruin the group. There is no neutral, verifiable “banker” that everyone can audit.

## Solution

With **PaluwagaChain**, members use their **Freighter** wallet; contributions and group rules are anchored in a **Soroban** contract on **Stellar Testnet**. Pool balances, rotation, and release paths are executed or verified on-chain, with Stellar’s low fees and fast settlement. A small **Node.js** backend optionally stores *shared* group metadata (name, list of wallet addresses, join state) in JSON so the UI can list groups for everyone during demos—on-chain state remains the source of truth for the live contract.

**Benefits**

- **Transparent accounting** — group state and transactions are inspectable on-chain and via explorers.
- **Wallet-native UX** — connect Freighter, see network, sign when required.
- **Clear separation** — smart contract for money rules; file-backed API for discoverability of created groups in development.

## Overview

PaluwagaChain digitizes the *paluwagan* loop for teams, offices, and communities that already save together, but want **verifiable** rotation and **USDC**-denominated pools on testnet. The name keeps “Paluwaga” and adds “Chain” to signal on-chain commitment.

**Key goals**

- Small, regular contributions in **USDC** (testnet configuration).
- **Rotation** and **release** logic enforced by the contract, not a spreadsheet.
- **Dashboard**, **create group**, **group detail**, and **profile** flows in the web app.
- **Freighter** for signing; Soroban RPC/Horizon URLs configurable via environment variables.

## Stellar features used

- **Soroban smart contract** — initialize pool rules, members, contributions, rotation, and reads such as `get_group_state` (see `paluwaga-chain/contracts/`).
- **Freighter** — connect wallet, enforce testnet, show network badge.
- **Horizon / RPC** — configured for testnet reads and invocations (see `frontend/.env.example`).
- **Stellar Expert** — verify transactions and contract on testnet (link your deployed contract ID).

## Core functions & features

- **User flows** — sign in (local app auth) → connect Freighter → create or join a group → view rotation and pool on the **Dashboard** and **Group detail** pages.
- **Group management** — create groups with name, member wallet addresses, contribution amount, and rotation interval; join shared groups when using the API.
- **Wallet & network** — Freighter integration, connection state, and disconnect.
- **Shared groups backend (optional)** — `GET/POST` groups and join so new groups appear for all users in dev; data lives in `backend/data/groups.json`.
- **Contract CLI** — deploy, initialize, `join_group`, `contribute`, `release`, `get_group_state` (see commands under `paluwaga-chain/README.md`).

## Target users

- **Savings groups** — offices, friend circles, and cooperatives that already do paluwagan-style pools.
- **Developers & students** — learn Soroban + Freighter + a minimal Express API in one repo.
- **Facilitators** — people who set up a group and want clearer rules and on-chain history.

## How it works (simplified)

1. **Deploy & initialize** the Soroban contract (admin, USDC token, contribution amount, rotation days).
2. **Members** connect Freighter and **join** on-chain; they **contribute** each round as the contract allows.
3. **Rotation** advances per contract state; **release** happens according to your contract’s rules.
4. **Optional API** — when `VITE_GROUPS_API_BASE_URL` points at the Express server, the frontend can **list** and **join** “shared” groups for UX; the chain remains authoritative for live balances.

**Client / backend (high level)**

```text
Browser (Vite + React)  ——►  Freighter (sign)
       |
       +——►  Soroban RPC / Horizon  (read + invoke)
       |
       +——►  Optional: GET/POST /groups, POST /groups/:id/join  (file-backed groups.json)
```

## Project structure

```text
MALUNGGAY-PANDESAL/              # Repository root
└─ paluwaga-chain/               # PaluwagaChain app
   ├─ contracts/
   │  └─ paluwaga_chain/         # Soroban Rust contract (lib.rs, tests)
   ├─ backend/                    # Express API for shared group metadata
   │  ├─ server.js
   │  └─ data/groups.json
   ├─ frontend/                   # React + Vite + Tailwind
   │  ├─ src/                     # pages, components, hooks, store, services
   │  └─ .env.example
   └─ README.md                   # Contract & env details for this subproject
```

## Architecture

| Layer     | Stack |
|----------|--------|
| Frontend | React, Vite, Tailwind, Zustand-style stores, Freighter |
| Backend  | Node.js, Express, CORS, JSON file persistence |
| On-chain | Soroban (Rust) contract, Stellar Testnet |

## Environment variables (frontend)

Copy `paluwaga-chain/frontend/.env.example` to `paluwaga-chain/frontend/.env` and set:

- `VITE_SOROBAN_RPC_URL` — Soroban RPC (e.g. testnet).
- `VITE_HORIZON_URL` — Horizon for testnet.
- `VITE_CONTRACT_ID` — Your deployed contract ID.
- `VITE_USDC_ISSUER` — Testnet USDC issuer as required by the app.
- `VITE_NETWORK_PASSPHRASE` — e.g. `Test SDF Network ; September 2015`.
- `VITE_GROUPS_API_BASE_URL` — e.g. `http://localhost:4000` when the groups API runs locally.

> Example contract ID in `.env.example` is for **development**; replace with your own deployment.

## Local development

**1. Shared groups API (optional but recommended for full “create + list” flows)**

```bash
cd paluwaga-chain/backend
npm install
npm run dev
```

Default: `http://localhost:4000` — health: `GET /health`, groups: `GET /groups`, `POST /groups`, `POST /groups/:id/join`.

**2. Frontend**

```bash
cd paluwaga-chain/frontend
npm install
cp .env.example .env   # then edit
npm run dev
```

**3. Contract**

Build, deploy, and CLI examples are documented in `paluwaga-chain/README.md` (initialize, `join_group`, `contribute`, `release`, `get_group_state`).

## Deploying on Vercel (avoiding 404)

A **blank 404** on `https://paluwaga-chain.vercel.app` almost always means Vercel is building from the **wrong folder**. This repo’s Vite app lives under `paluwaga-chain/frontend`, not the repository root.

1. In Vercel: **Project → Settings → General → Root Directory** → set to **`paluwaga-chain/frontend`** (or create the project and choose that subdirectory when importing).
2. **Framework Preset:** Vite (auto-detected after the root is correct). **Build Command:** `npm run build` (default). **Output Directory:** `dist` (Vite default).
3. **Environment Variables** — add the same keys as in `paluwaga-chain/frontend/.env.example` (with `VITE_` prefix). For production, `VITE_GROUPS_API_BASE_URL` must be a **public HTTPS URL** if you use the shared-groups API (deploy the Express backend elsewhere or use a serverless API; the sample JSON API is for local dev).
4. Redeploy. The included `paluwaga-chain/frontend/vercel.json` adds a SPA **rewrite** so client routes (e.g. `/dashboard`) load `index.html` instead of 404.

If the root directory stays the monorepo root, Vercel may find no Vite `index.html` output and the whole site returns **404**.

## API endpoints (backend)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `GET` | `/groups` | List shared groups from `data/groups.json` |
| `POST` | `/groups` | Create a group (name, `creatorUserId`, members, contribution, rotation days) |
| `POST` | `/groups/:id/join` | Body: `{ "userId": "..." }` — append user to `memberUserIds` |

## Smart contract (reference)

- Build and deploy steps: **`paluwaga-chain/README.md`**
- After deployment, set `VITE_CONTRACT_ID` in the frontend and verify the contract on [Stellar Expert](https://stellar.expert) (Testnet) using your contract address.

## Tech stack

- **Smart contracts:** Soroban (Rust)
- **Frontend:** React, Vite, Tailwind CSS
- **Wallet:** Freighter (Stellar)
- **Network:** Stellar **Testnet** (by default in examples)

## Privacy & custody

- **Non-custodial signing** — private keys stay in the user’s browser via Freighter.
- The **backend** stores only what you write to `groups.json` (e.g. group name, public wallet strings, app user ids for joins). Do not put secrets or seed phrases in the repo or API.

## Why Stellar & Soroban

- **Fast, cheap** transactions suitable for frequent contribution flows.
- **Soroban** — explicit on-chain logic for pool and rotation.
- **Auditable** — explorers and contract reads support transparency for the group.

---

*Repository folder name: `MALUNGGAY-PANDESAL` — product name and source live under `paluwaga-chain/`.*

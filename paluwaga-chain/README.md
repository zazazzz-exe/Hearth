# PaluwagaChain

[![LIVE DEMO](https://img.shields.io/badge/%E2%96%B2%20LIVE%20DEMO-0B1220?style=for-the-badge&labelColor=0B1220&color=0B1220)](https://paluwaga-chain-zarrah-valles-projects.vercel.app)
![ISDA-SURE](https://img.shields.io/badge/ISDA--SURE-f59e0b?style=for-the-badge&labelColor=f59e0b&color=f59e0b)
![STELLAR](https://img.shields.io/badge/%E2%9C%94%20STELLAR-4b5563?style=for-the-badge&labelColor=4b5563&color=4b5563)
![TESTNET](https://img.shields.io/badge/TESTNET-7c3aed?style=for-the-badge&labelColor=7c3aed&color=7c3aed)
![SOROBAN SDK](https://img.shields.io/badge/SOROBAN%20SDK-111827?style=for-the-badge&labelColor=111827&color=111827)
![22.0.0](https://img.shields.io/badge/22.0.0-3b82f6?style=for-the-badge&labelColor=3b82f6&color=3b82f6)
![VITE](https://img.shields.io/badge/%E2%9A%A1%20VITE-374151?style=for-the-badge&labelColor=374151&color=374151)
![5.4.21](https://img.shields.io/badge/5.4.21-6366f1?style=for-the-badge&labelColor=6366f1&color=6366f1)
![PRIVACY](https://img.shields.io/badge/PRIVACY-4b5563?style=for-the-badge&labelColor=4b5563&color=4b5563)
![NON-CUSTODIAL](https://img.shields.io/badge/NON--CUSTODIAL-2563eb?style=for-the-badge&labelColor=2563eb&color=2563eb)

PaluwagaChain is a full-stack Web3 dApp for rotating savings (paluwagan) on Stellar Soroban.
Members contribute USDC each round, and the contract automatically releases the full pooled amount
based on rotation order.

## Project Structure

```text
paluwaga-chain/
  contracts/
    paluwaga_chain/
      src/
        lib.rs
        test.rs
      Cargo.toml
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      store/
    package.json
  backend/
    server.js
    data/
      groups.json
    package.json
```

## Environment Variables (Frontend)

Create `frontend/.env` based on `frontend/.env.example`:

```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CONTRACT_ID=CDVBVFHHBKV2NKOLMM3BCHJQTEIFBXJZ2DMH7SMT22RI3W3GHZJOBM62
VITE_USDC_ISSUER=<testnet_usdc_issuer>
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GROUPS_API_BASE_URL=http://localhost:4000
```

`VITE_GROUPS_API_BASE_URL` enables a shared groups backend so created groups appear for all users.

## Shared Groups Backend

Start the backend server before running the frontend:

```bash
cd backend
npm install
npm run dev
```

Backend endpoints used by the app:

- `GET /groups`
- `POST /groups`
- `POST /groups/:id/join`

## Contract Build and Deployment

1. Build wasm:

```bash
cargo build --target wasm32-unknown-unknown --release
```

2. Deploy contract:

```bash
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/paluwaga_chain.wasm --source <SECRET_KEY> --network testnet
```

3. Initialize contract:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <SECRET_KEY> --network testnet -- initialize --admin <ADMIN_ADDRESS> --token_address <USDC_CONTRACT> --contribution_amount 10000000 --rotation_interval_days 7
```

4. Start frontend:

```bash
npm install && npm run dev
```

## Sample CLI Calls for Contract Functions

Initialize:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <ADMIN_SECRET> --network testnet -- initialize --admin GADMINADDRESS123 --token_address CUSDCADDRESS123 --contribution_amount 10000000 --rotation_interval_days 7
```

Join group:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <MEMBER_SECRET> --network testnet -- join_group --member_address GMEMBERADDR123
```

Contribute:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <MEMBER_SECRET> --network testnet -- contribute --member_address GMEMBERADDR123
```

Release:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <ADMIN_SECRET> --network testnet -- release
```

Get group state:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <ANY_SECRET> --network testnet -- get_group_state
```

Get member info:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <ANY_SECRET> --network testnet -- get_member_info --address GMEMBERADDR123
```

## Frontend Features Included

- Wallet connection and signing via Freighter
- Testnet enforcement and network badge
- Dashboard, group creation, group detail, and profile pages
- Contribution action flow with transaction toast and explorer link
- Soroban service helpers for invoke/read/account balance

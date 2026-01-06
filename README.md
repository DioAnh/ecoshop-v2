EcoShop - Shop-to-Earn and ReFi Platform on Sui Blockchain
"Transforming consumption costs into green investment assets."

EcoShop is a next-generation Web3 e-commerce platform built on the Sui Blockchain. Unlike traditional e-commerce marketplaces, EcoShop implements a Regenerative Finance (ReFi) model, empowering users to not only purchase environmentally friendly products but also generate returns (Shop-to-Earn) and immediately reinvest (Shop-to-Invest) into the green supply chain.

Table of Contents
1. Problem and Solution
2. Core Mechanics
3. Key Features
4. Tokenomics
5. Tech Stack
6. Installation Guide
7. Roadmap



1. Problem and Solution
The Pain Point
High Cost of Green Products: Eco-friendly products often carry a higher price tag compared to conventional products (Green Premium), deterring price-sensitive consumers.

Lack of Incentives: Consumers lack direct financial motivation to prioritize environmental protection.

Capital Gap: Green manufacturing projects often face capital shortages for Research and Development (R&D) and scaling operations.

The Solution
EcoShop converts the price difference (Green Premium) into ECO Tokens. Users accept paying a higher price, but the excess amount is not lost; instead, it is transformed into a digital asset. This asset can subsequently generate yield through Staking or be reinvested directly into the manufacturer.


2. Core Mechanics
The following logic distinguishes EcoShop from standard platforms:

2.1. Green Premium as Investment
When purchasing a product on EcoShop, the price may exceed the market average.

Logic: EcoShop Price - Market Price = ECO Token Allocation.

Conversion Rate: 1 ECO = 1,000 VND.

Cap: To prevent inflation, rewards per product are capped at 50 ECO (equivalent to 50,000 VND), regardless of the total CO2 reduction volume.

2.2. Dual Wallet System
To bridge Web2 and Web3, the system utilizes two parallel wallets:

VND Wallet (Fiat): Used for payments and bank withdrawals, ensuring safety and real-world liquidity.

ECO Wallet (On-chain): Used for Staking, Reinvestment, DAO governance participation, and receiving rewards.

Swap Mechanism: Supports only a one-way exchange from ECO to VND (incurring a 0.1% burn fee). Direct purchase of ECO using VND is prohibited to prevent speculation.


2.3. Gamified Green Delivery
Delivery choices directly impact the user's wallet balance:

Bicycle (8-12 days): +5 ECO (Reward for zero emissions).

Electric Vehicle (3-5 days): +2 ECO (Reward for low emissions).

Standard Gas Vehicle: -2 ECO (Minor penalty for pollution).

Express Gas Vehicle: -5 ECO (Major penalty for prioritizing convenience over environmental impact).



3. Key Features
Instant Reinvest (Micro-Venture Capital)
Upon successful payment, users receive ECO Tokens. Instead of leaving tokens idle, EcoShop offers an immediate Micro-Venture Capital opportunity:

Users can stake the newly received ECO back into the specific product purchased.

Terms: 6 months, 1 year, or 2 years with increasing APR (12% - 50%).

Risk: Tied directly to the product lifecycle (if the product is delisted, the invested tokens are lost).

Reward: Receipt of an Investment Certificate NFT (Proof-of-Investment) in the user profile.

Eco Vault
Designed for risk-averse users:

Users can stake ECO into the platform's insurance fund.

Four tiers: Seedling (Flexible, 1.5%), Sapling (30 days, 6%), Old Forest (1 year, 18%), and Ancient Tree (4 years, 45%).

The flexible package allows withdrawals at any time with a nominal fee (0.1%).

Web3 Profile and Dashboard
Displays total asset value (VND + ECO).

Tracks actual CO2 reduction volume.

Showcases the Investment Certificate NFT collection.

Provides a transparent, on-chain transaction history.



4. Tokenomics
Token Name: ECO Token.

Peg: Soft-peg where 1 ECO is approximately 1,000 VND (at the time of internal conversion).

Supply: Elastic Supply based on Proof-of-Carbon-Reduction.

Burn Mechanism:

Swap fee from ECO to VND (0.1%).

Early withdrawal fee from Vault (0.1%).

Penalties for selecting gas-based delivery options (-2 to -5 ECO).



5. Tech Stack
The project is built using modern technologies:

Frontend: React (Vite), TypeScript.

Styling: Tailwind CSS, Shadcn UI (for a clean and modern interface).

State Management: React Context API (Cart, Wallet, and User management).

Backend / Database: Supabase (Storage for Users, Products, and Transactions).

Blockchain Integration:

Sui Network: Layer 1 Blockchain offering high speed and low fees.

@suiet/wallet-kit: Connection interface for Sui Wallet, Suiet, Ethos, etc.



6. Installation Guide
Follow these steps to run the project locally:

Clone Repository:

Bash

git clone https://github.com/your-username/ecoshop.git
cd ecoshop
Install Dependencies:

Bash

npm install
# or
yarn install
Configure Environment Variables (.env): Create a .env file and add your Supabase credentials:

Đoạn mã

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the Project:

Bash

npm run dev
Access http://localhost:8080 to experience the application.



7. Roadmap
Phase 1 (MVP): Completion of shopping flow, Sui wallet integration, Reinvest and Vault logic (Current Status).

Phase 2: Smart Contract Audit, ECO Token Mainnet launch.

Phase 3: Expansion of the Marketplace to allow Vendors to list items and crowdfund.

Phase 4: DAO Governance, allowing ECO holders to vote on product listings.

EcoShop - Built for a Greener Future on Sui.
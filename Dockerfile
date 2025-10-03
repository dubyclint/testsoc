FROM node:20-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create ABI file for smart contracts
RUN mkdir -p scripts && cat > scripts/abi.json << 'EOF'
[
  {
    "inputs": [],
    "name": "getValue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "setValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_buyer", "type": "address"},
      {"internalType": "address", "name": "_seller", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "createEscrow",
    "outputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "releaseEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
EOF

# Create Supabase database utility
RUN cat > server/utils/database.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
export const db = supabase
EOF

# Fix const reassignment in match files and update for Supabase
RUN sed -i 's/const topCandidates =/let topCandidates =/g' server/api/match/group.ts
RUN sed -i 's/const topCandidates =/let topCandidates =/g' server/api/match/eventGroup.ts

# Update database imports for Supabase
RUN find server/api -name "*.ts" -exec grep -l "db\." {} \; | xargs -I {} sh -c 'sed -i "1i import { supabase } from \"~/server/utils/database\"" "$1"' _ {}

# Remove duplicate ChatWindow component
RUN rm -f components/ChatWindow.vue

# Fix Vue imports in components
RUN find components -name "*.vue" -exec grep -l "ref\|reactive\|computed" {} \; | xargs -I {} sh -c 'if ! grep -q "import.*vue" "$1"; then sed -i "s/<script setup>/<script setup>\nimport { ref, reactive, computed, onMounted } from \"vue\";/" "$1"; fi' _ {}

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

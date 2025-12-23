#!/bin/bash
set -e

# ================= CONFIG =================
TABLE_NAME="asc-ftv-dev-users"
REGION="us-east-1"
# ==========================================

# ---------- USERS ----------
USERS=(
  "joao@asc.com:joao123:João"
  "maria@asc.com:maria123:Maria"
  "carlos@asc.com:carlos123:Carlos"
  "ana@asc.com:ana123:Ana"
  "pedro@asc.com:pedro123:Pedro"
  "lucas@asc.com:lucas123:Lucas"
  "julia@asc.com:julia123:Júlia"
  "rafael@asc.com:rafael123:Rafael"
)
# ----------------------------

echo "🔎 Verificando bcryptjs..."

if ! node -e "require('bcryptjs')" >/dev/null 2>&1; then
  echo "📦 bcryptjs não encontrado. Instalando localmente..."
  npm init -y >/dev/null 2>&1 || true
  npm install bcryptjs >/dev/null
fi

echo "🚀 Criando usuários VIEWERS..."

for USER in "${USERS[@]}"; do
  IFS=":" read -r EMAIL PASSWORD USERNAME <<< "$USER"

  echo "🔐 Gerando hash para $EMAIL..."
  HASH=$(node -e "console.log(require('bcryptjs').hashSync('$PASSWORD', 10))")

  if [[ -z "$HASH" ]]; then
    echo "❌ ERRO ao gerar hash para $EMAIL"
    exit 1
  fi

  echo "📦 Criando usuário $USERNAME ($EMAIL)..."

  aws dynamodb put-item \
    --region "$REGION" \
    --table-name "$TABLE_NAME" \
    --item "{
      \"email\":         {\"S\": \"$EMAIL\"},
      \"username\":      {\"S\": \"$USERNAME\"},
      \"password_hash\": {\"S\": \"$HASH\"},
      \"role\":          {\"S\": \"viewer\"},
      \"active\":        {\"BOOL\": true}
    }"
done

echo ""
echo "✅ 8 usuários VIEWERS criados com sucesso!"
echo ""
echo "📋 Credenciais:"
for USER in "${USERS[@]}"; do
  IFS=":" read -r EMAIL PASSWORD USERNAME <<< "$USER"
  echo "👀 $USERNAME -> $EMAIL | $PASSWORD"
done

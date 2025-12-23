#!/bin/bash
set -e

# ================= CONFIG =================
TABLE_NAME="asc-ftv-dev-users"
REGION="us-east-1"

ADMIN_EMAIL="admin@asc.com"
ADMIN_PASSWORD="admin123"

VIEWER_EMAIL="viewer@asc.com"
VIEWER_PASSWORD="viewer123"
# ==========================================

echo "🔎 Verificando bcryptjs..."

if ! node -e "require('bcryptjs')" >/dev/null 2>&1; then
  echo "📦 bcryptjs não encontrado. Instalando localmente..."
  npm init -y >/dev/null 2>&1 || true
  npm install bcryptjs >/dev/null
fi

echo "🔐 Gerando hashes de senha..."

ADMIN_HASH=$(node -e "console.log(require('bcryptjs').hashSync('$ADMIN_PASSWORD', 10))")
VIEWER_HASH=$(node -e "console.log(require('bcryptjs').hashSync('$VIEWER_PASSWORD', 10))")

if [[ -z "$ADMIN_HASH" || -z "$VIEWER_HASH" ]]; then
  echo "❌ ERRO: Hash de senha não foi gerado corretamente"
  exit 1
fi

echo "📦 Criando usuário ADMIN..."

aws dynamodb put-item \
  --region "$REGION" \
  --table-name "$TABLE_NAME" \
  --item "{
    \"email\":         {\"S\": \"$ADMIN_EMAIL\"},
    \"username\":      {\"S\": \"Administrador\"},
    \"password_hash\": {\"S\": \"$ADMIN_HASH\"},
    \"role\":          {\"S\": \"admin\"},
    \"active\":        {\"BOOL\": true}
  }"

echo "📦 Criando usuário VIEWER..."

aws dynamodb put-item \
  --region "$REGION" \
  --table-name "$TABLE_NAME" \
  --item "{
    \"email\":         {\"S\": \"$VIEWER_EMAIL\"},
    \"username\":      {\"S\": \"Visualizador\"},
    \"password_hash\": {\"S\": \"$VIEWER_HASH\"},
    \"role\":          {\"S\": \"viewer\"},
    \"active\":        {\"BOOL\": true}
  }"

echo ""
echo "✅ Usuários recriados com hash válido!"
echo "👑 Admin  -> $ADMIN_EMAIL | $ADMIN_PASSWORD"
echo "👀 Viewer -> $VIEWER_EMAIL | $VIEWER_PASSWORD"

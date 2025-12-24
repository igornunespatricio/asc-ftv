#!/bin/bash
# ---------------------------------------------------------
# Script para gerar JWT_SECRET aleatório e atualizar terraform.tfvars
# ---------------------------------------------------------

set -e

TFVARS_FILE="./infra/terraform.tfvars"

# Gerar JWT secreto aleatório (256 bits codificado em Base64)
JWT_SECRET=$(openssl rand -base64 32)

# Garantir que o arquivo exista, se não existir cria com valores padrão
if [ ! -f "$TFVARS_FILE" ]; then
  echo "Criando $TFVARS_FILE..."
  cat > "$TFVARS_FILE" <<EOF
jwt_secret = "$JWT_SECRET"
aws_region = "us-east-1"
EOF
else
  echo "Atualizando jwt_secret em $TFVARS_FILE..."
  # Atualiza a linha do jwt_secret usando delimitador | para evitar conflitos com /
  if grep -q '^jwt_secret' "$TFVARS_FILE"; then
    sed -i "s|^jwt_secret = .*|jwt_secret = \"$JWT_SECRET\"|" "$TFVARS_FILE"
  else
    # Se não existir a linha, adiciona no topo
    sed -i "1ijwt_secret = \"$JWT_SECRET\"" "$TFVARS_FILE"
  fi
fi

echo "JWT secreto atualizado com sucesso!"
echo "jwt_secret = $JWT_SECRET"

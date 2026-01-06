# ---------------------------------------------------------
# Configurações padrão
# ---------------------------------------------------------
TERRAFORM_DIR ?= infra
WORKSPACE     ?= dev
TF            ?= terraform

# ---------------------------------------------------------
# Targets que não geram arquivos
# ---------------------------------------------------------
.PHONY: init fmt validate workspace plan apply destroy \
        dev dev-plan dev-apply dev-destroy \
        prod prod-plan prod-apply prod-destroy \
        check terraform docs lambda-install lambda-install-all \
        frontend-install frontend-build frontend-clean

# ---------------------------------------------------------
# Lambda install
# ---------------------------------------------------------

lambda-install:
	@if [ -z "$(path)" ]; then \
		echo "❌ Uso: make lambda-install path=CAMINHO_DA_LAMBDA"; \
		exit 1; \
	fi
	@if [ ! -d "$(path)" ]; then \
		echo "❌ Diretório não encontrado: $(path)"; \
		exit 1; \
	fi
	@if [ ! -f "$(path)/package.json" ]; then \
		echo "❌ package.json não encontrado em $(path)"; \
		exit 1; \
	fi
	@echo "🧹 Limpando dependências da lambda em $(path)"
	@cd $(path) && \
	rm -rf node_modules package-lock.json && \
	echo "📥 Instalando dependências (produção)" && \
	npm install --omit=dev
	@echo "✅ Lambda reconstruída com package.json existente: $(path)"

lambda-install-all:
	@echo "🔄 Instalando dependências para todas as lambdas..."
	@for dir in lambdas/*/; do \
		if [ -d "$$dir" ] && [ -f "$${dir}package.json" ]; then \
			echo "📦 Processando $${dir%/}"; \
			$(MAKE) lambda-install path="$${dir}"; \
		fi; \
	done
	@echo "✅ Todas as lambdas foram processadas"

# ---------------------------------------------------------
# Frontend operations
# ---------------------------------------------------------

frontend-install:
	@echo "📦 Installing frontend dependencies..."
	@cd frontend && npm install

frontend-build: frontend-install
	@echo "🔨 Building frontend with TypeScript..."
	@cd frontend && npm run build
	@echo "✅ Frontend built successfully"

frontend-clean:
	@echo "🧹 Cleaning frontend build artifacts..."
	@cd frontend && rm -rf dist/

# ---------------------------------------------------------
# Qualidade e validação
# ---------------------------------------------------------

fmt:
	cd $(TERRAFORM_DIR) && $(TF) fmt -recursive

validate:
	cd $(TERRAFORM_DIR) && $(TF) validate

docs:
	cd $(TERRAFORM_DIR) && terraform-docs markdown table --output-file README.md --output-mode inject .

check: fmt validate docs
	@echo "✔ Terraform fmt e validate concluídos com sucesso"

# ---------------------------------------------------------
# Workspace
# ---------------------------------------------------------

workspace:
	cd $(TERRAFORM_DIR) && \
	$(TF) workspace select $(WORKSPACE) || \
	$(TF) workspace new $(WORKSPACE)

# ---------------------------------------------------------
# Terraform base
# ---------------------------------------------------------

init:
	cd $(TERRAFORM_DIR) && $(TF) init -upgrade

plan: frontend-build workspace
	cd $(TERRAFORM_DIR) && $(TF) plan

# ---------------------------------------------------------
# Apply / Destroy (com proteção para prod)
# ---------------------------------------------------------

apply: frontend-build workspace
ifeq ($(WORKSPACE),prod)
	cd $(TERRAFORM_DIR) && $(TF) apply
else
	cd $(TERRAFORM_DIR) && $(TF) apply -auto-approve
endif

destroy: workspace
ifeq ($(WORKSPACE),prod)
	cd $(TERRAFORM_DIR) && $(TF) destroy
else
	cd $(TERRAFORM_DIR) && $(TF) destroy -auto-approve
endif

# ---------------------------------------------------------
# Pipeline completo (dev only)
# ---------------------------------------------------------

terraform: frontend-build lambda-install-all init check plan apply

# ---------------------------------------------------------
# Atalhos por ambiente
# ---------------------------------------------------------

# DEV
dev: WORKSPACE=dev
dev: frontend-build lambda-install-all apply

dev-plan: WORKSPACE=dev
dev-plan: plan

dev-apply: WORKSPACE=dev
dev-apply: apply

dev-destroy: WORKSPACE=dev
dev-destroy: destroy

# PROD
prod: WORKSPACE=prod
prod: frontend-build lambda-install-all apply

prod-plan: WORKSPACE=prod
prod-plan: plan

prod-apply: WORKSPACE=prod
prod-apply: apply

prod-destroy: WORKSPACE=prod
prod-destroy: destroy

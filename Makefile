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
        check terraform docs

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

plan: workspace
	cd $(TERRAFORM_DIR) && $(TF) plan

# ---------------------------------------------------------
# Apply / Destroy (com proteção para prod)
# ---------------------------------------------------------

apply: workspace
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

terraform: init check plan apply

# ---------------------------------------------------------
# Atalhos por ambiente
# ---------------------------------------------------------

# DEV
dev: WORKSPACE=dev
dev: apply

dev-plan: WORKSPACE=dev
dev-plan: plan

dev-apply: WORKSPACE=dev
dev-apply: apply

dev-destroy: WORKSPACE=dev
dev-destroy: destroy

# PROD
prod: WORKSPACE=prod
prod: apply

prod-plan: WORKSPACE=prod
prod-plan: plan

prod-apply: WORKSPACE=prod
prod-apply: apply

prod-destroy: WORKSPACE=prod
prod-destroy: destroy

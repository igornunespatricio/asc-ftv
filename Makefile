# ---------------------------------------------------------
# Makefile para Lambda + Terraform
# ---------------------------------------------------------

# Diretórios
BACKEND_DIR := backend
LAMBDA_DIRS := $(wildcard $(BACKEND_DIR)/*)
TERRAFORM_DIR := infra

# Workspace padrão
WORKSPACE ?= dev

.PHONY: lambda terraform terraform-init terraform-plan terraform-apply terraform-destroy clean dev prod dev-plan prod-plan dev-destroy prod-destroy setup

# ---------------------------------------------------------
# Preparar Lambdas
# ---------------------------------------------------------
lambda:
	@for dir in $(LAMBDA_DIRS); do \
		echo "----------------------------------------"; \
		echo " Processing Lambda in directory: $$dir"; \
		echo "----------------------------------------"; \
		\
		if [ -f "$$dir/package.json" ]; then \
			echo "Removing old package.json..."; \
			rm "$$dir/package.json"; \
		fi; \
		if [ -d "$$dir/node_modules" ]; then \
			echo "Removing old node_modules..."; \
			rm -rf "$$dir/node_modules"; \
		fi; \
		\
		echo "Initializing npm project..."; \
		(cd $$dir && npm init -y >/dev/null); \
		\
		echo "Installing dependencies..."; \
		(cd $$dir && npm install aws-sdk uuid@8 >/dev/null); \
		\
		ZIP_NAME="$$(basename $$dir).zip"; \
		echo "Creating zip: $$ZIP_NAME"; \
		(cd $$dir && zip -r "$$ZIP_NAME" . >/dev/null); \
		\
		echo " Lambda packaged: $$dir"; \
	done

# ---------------------------------------------------------
# Terraform commands
# ---------------------------------------------------------
init:
	cd $(TERRAFORM_DIR) && terraform init -upgrade

plan:
	cd $(TERRAFORM_DIR) && terraform workspace select $(WORKSPACE)
	cd $(TERRAFORM_DIR) && terraform plan

apply:
	cd $(TERRAFORM_DIR) && terraform workspace select $(WORKSPACE)
	cd $(TERRAFORM_DIR) && terraform apply -auto-approve

destroy:
	cd $(TERRAFORM_DIR) && terraform workspace select $(WORKSPACE)
	cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# Conveniência: init, plan e apply juntos
terraform: init plan apply

# ---------------------------------------------------------
# Workspaces específicos
# ---------------------------------------------------------
dev:
	$(MAKE) WORKSPACE=dev apply

prod:
	$(MAKE) WORKSPACE=prod apply

dev-plan:
	$(MAKE) WORKSPACE=dev plan

prod-plan:
	$(MAKE) WORKSPACE=prod plan

dev-destroy:
	$(MAKE) WORKSPACE=dev destroy

prod-destroy:
	$(MAKE) WORKSPACE=prod destroy

# ---------------------------------------------------------
# Setup inicial de diretórios
# ---------------------------------------------------------
setup: 
	bash scripts/setup_structure.sh

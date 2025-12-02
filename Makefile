# Path to the Lambda
BACKEND_DIR := backend
LAMBDA_DIRS := $(wildcard $(BACKEND_DIR)/*)
TERRAFORM_DIR=infra

.PHONY: lambda terraform terraform-init terraform-plan terraform-apply terraform-destroy clean

# Prepare the Lambda: initialize Node.js, install dependencies, and create zip
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

# Terraform commands
terraform-init:
	cd $(TERRAFORM_DIR) && terraform init -upgrade

terraform-plan:
	cd $(TERRAFORM_DIR) && terraform plan

terraform-apply:
	cd $(TERRAFORM_DIR) && terraform apply -auto-approve

terraform-destroy:
	cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# Convenience target: run init, plan, apply
terraform: terraform-init terraform-plan terraform-apply
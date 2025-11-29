# Path to the Lambda
LAMBDA_DIR=backend/add_game
ZIP_FILE=$(LAMBDA_DIR)/add_game.zip
TERRAFORM_DIR=infra

.PHONY: lambda terraform terraform-init terraform-plan terraform-apply terraform-destroy clean

# Prepare the Lambda: initialize Node.js, install dependencies, and create zip
lambda:
	# Remove old package.json and node_modules to force fresh install
	@if [ -f "$(LAMBDA_DIR)/package.json" ]; then \
		echo "Removing old package.json..."; \
		rm $(LAMBDA_DIR)/package.json; \
	fi
	@if [ -d "$(LAMBDA_DIR)/node_modules" ]; then \
		echo "Removing old node_modules..."; \
		rm -rf $(LAMBDA_DIR)/node_modules; \
	fi
	# Initialize npm project
	cd $(LAMBDA_DIR) && npm init -y
	# Install npm dependencies
	cd $(LAMBDA_DIR) && npm install aws-sdk uuid@8
	# Remove old zip if it exists
	@if [ -f "$(ZIP_FILE)" ]; then \
		echo "Removing old zip..."; \
		rm $(ZIP_FILE); \
	fi
	# Create new zip
	echo "Creating new zip for Lambda..."
	cd $(LAMBDA_DIR) && zip -r add_game.zip .


# Terraform commands
terraform-init:
	cd $(TERRAFORM_DIR) && terraform init

terraform-plan:
	cd $(TERRAFORM_DIR) && terraform plan

terraform-apply:
	cd $(TERRAFORM_DIR) && terraform apply -auto-approve

terraform-destroy:
	cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# Convenience target: run init, plan, apply
terraform: terraform-init terraform-plan terraform-apply
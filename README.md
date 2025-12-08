pre requisites:

- aws cli
- aws configure
- terraform

steps:

1. make setup
2. run terraform workspaces below

```bash
terraform workspace new dev
terraform workspace new prod
terraform workspace select dev
```

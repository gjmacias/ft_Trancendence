# waf-policy.hcl
path "transcendence/*" {
  capabilities = ["read", "list", "create"]
}


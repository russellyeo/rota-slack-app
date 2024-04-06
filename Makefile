# Deploy the application to the production environment
deploy_production:
	fly deploy --config fly.production.toml

# Deploy the application to staging environment
deploy_staging:
	fly deploy --config fly.staging.toml
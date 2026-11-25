
# --- Konfigurasi ---
.DEFAULT_GOAL := help

ENV ?= development
KNEX = npx tsx node_modules/knex/bin/cli.js
KNEXFILE = src/shared/config/knexfile.ts

.PHONY: help migrate-new migrate-up migrate-down migrate-status seed db-reset

help:
	@echo "Available commands:"
	@echo "  make migrate-new name=create_users_table"
	@echo "  make migrate-up"
	@echo "  make migrate-down"
	@echo "  make migrate-status"
	@echo "  make seed"
	@echo "  make db-reset"


# Buat migration baru
migrate-new:
	@powershell -NoProfile -Command "if ([string]::IsNullOrWhiteSpace('$(name)')) { Write-Host 'Harus menggunakan name=<nama_migration>'; exit 1 }"
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:make $(name) --knexfile $(KNEXFILE) --env $(ENV)

# Jalankan semua migration
migrate-up:
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:latest --knexfile $(KNEXFILE) --env $(ENV)

# Rollback migration terakhir
migrate-down:
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:rollback --knexfile $(KNEXFILE) --env $(ENV)

# Lihat status migration
migrate-status:
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:list --knexfile $(KNEXFILE) --env $(ENV)

# Jalankan semua seeder
seed:
	npx cross-env NODE_ENV=$(ENV) $(KNEX) seed:run --knexfile $(KNEXFILE) --env $(ENV)

# Reset database: rollback semua -> migrate ulang -> seed
db-reset:
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:rollback --all --knexfile $(KNEXFILE) --env $(ENV)
	npx cross-env NODE_ENV=$(ENV) $(KNEX) migrate:latest --knexfile $(KNEXFILE) --env $(ENV)
	npx cross-env NODE_ENV=$(ENV) $(KNEX) seed:run --knexfile $(KNEXFILE) --env $(ENV)

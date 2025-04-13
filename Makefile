.PHONY: dev stop-dev simulation stop-simulation deploy-backend stop-backend dump-dev dump-prod restore-dev restore-prod clean init

# Développement
dev:
	docker compose -f docker-compose.dev.yml up -d

stop-dev:
	docker compose -f docker-compose.dev.yml down

# Simulation locale (test de prod en local)
simulation:
	docker compose -f docker-compose.backend.yml up -d

stop-simulation:
	docker compose -f docker-compose.backend.yml down

# Déploiement backend (API + DB uniquement)
deploy-backend:
	docker compose -f docker-compose.backend.yml up -d

stop-backend:
	docker compose -f docker-compose.backend.yml down

# Base de données
dump-dev:
	./scripts/db-dump.sh dev

dump-prod:
	./scripts/db-dump.sh prod

# Restaurer depuis le dernier dump (ou un fichier spécifié)
restore-dev:
	@if [ -z "$(file)" ]; then \
		LATEST_DUMP=$$(ls -t ./db/dumps/*.sql | head -1); \
		if [ -z "$$LATEST_DUMP" ]; then \
			echo "Aucun fichier dump trouvé"; \
			exit 1; \
		fi; \
		./scripts/db-restore.sh $$LATEST_DUMP dev; \
	else \
		./scripts/db-restore.sh $(file) dev; \
	fi

restore-prod:
	@if [ -z "$(file)" ]; then \
		LATEST_DUMP=$$(ls -t ./db/dumps/*.sql | head -1); \
		if [ -z "$$LATEST_DUMP" ]; then \
			echo "Aucun fichier dump trouvé"; \
			exit 1; \
		fi; \
		./scripts/db-restore.sh $$LATEST_DUMP prod; \
	else \
		./scripts/db-restore.sh $(file) prod; \
	fi

# Nettoyer les images et volumes non utilisés
clean:
	docker system prune -af

# Créer la structure de dossiers nécessaire
init:
	mkdir -p db/dumps uploads
	chmod +x scripts/*.sh

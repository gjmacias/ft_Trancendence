# Variables globales
BASE_FILE=./srcs/docker-compose.yml
DEV_FILE=./srcs/docker-compose.dev.yml
MODE?=false

ifeq ($(MODE), true)
  COMPOSE_FILE=$(DEV_FILE)
else
  COMPOSE_FILE=$(BASE_FILE)
endif
COMPOSE_CMD=docker compose -f $(COMPOSE_FILE)

# Colores para logs bonitos
BLUE=\033[1;34m
GREEN=\033[1;32m
NC=\033[0m

# Target por defecto
all: excecute_scripts #set_host
	@echo "$(GREEN)==> Iniciando todos los servicios $(COMPOSE_FILE)...$(NC)"
ifeq ($(SCALE_WAF), 0)
	@$(COMPOSE_CMD) up -d --build --scale waf=0
else
	@$(COMPOSE_CMD) up -d --build
endif

excecute_scripts: create_certs
	@echo "$(NC)==> Ejecutando scripts...$(NC)"
	@./srcs/scripts/update_jwt_secret.sh

create_certs:
	@chmod -R 755 ./srcs/scripts
	@./srcs/scripts/create_certs.sh

delete_certs:
	@./srcs/scripts/delete_certs.sh

#Reconstruir contenedores
up:
	@echo "$(BLUE)==> Remontando servicios...$(NC)"
	@$(COMPOSE_CMD) up --build

# Targets por servicio individual
# Servicios que no requieren pasos adicionales
up-%:
	@echo "$(BLUE)==> Levantando $*...$(NC)"
	@$(COMPOSE_CMD) up --build $*

# Solo servicios básicos
up_basic: excecute_scripts
	@echo "$(BLUE)==> Remontando servicios...$(NC)"
	@$(COMPOSE_CMD) up --build backend frontend

#Para entrar en el bash
sh-%:
	@echo "$(BLUE)==> Entrando en sh del contenedor $*...$(NC)"
	@cd srcs/containers/$*/
	@docker exec -it $* sh

down:
	@echo "$(BLUE)==> Bajando servicios$(COMPOSE_FILE)...$(NC)"
	@$(COMPOSE_CMD) down

game: excecute_scripts
	@echo "$(BLUE)==> Levantando el juego...$(NC)"
	docker-compose -f srcs/docker-compose.game.yml up -d --build

# Setear entrada en /etc/hosts
#set_host:
#	@if ! grep -q "transcendence.es" /etc/hosts; then \
#		echo "$(BLUE)==> Añadiendo transcendence.es a /etc/hosts...$(NC)"; \
#		echo "127.0.0.1	transcendence.es" | sudo tee -a /etc/hosts > /dev/null;\
#	fi

# Limpiar entrada del /etc/hosts
#remove_host:
#	@if grep -q "127.0.0.1	transcendence.es" /etc/hosts; then \
#		echo "$(BLUE)==> Quitando transcendence.es de /etc/hosts...$(NC)"; \
#		sudo sed -i '/127.0.0.1[[:space:]]\+transcendence.es/d' /etc/hosts; \
#	fi

# Limpiar contenedores e imágenes
clean: delete_certs down
	@echo "$(BLUE)==> Limpiando imágenes y volúmenes...$(NC)"
	@docker rmi srcs-backend srcs-blockchain srcs-frontend srcs-game srcs-vault srcs-waf srcs-grafana srcs-prometheus || true
	@docker volume rm srcs_backend-data srcs_blockchain-data srcs_frontend-data srcs_game-data || true

fclean: clean #remove_host

# Full clean and prune
prune:  fclean
	@echo "$(BLUE)==> Clean and Prune, say yes...$(NC)"
	@docker system prune

# Rebuild completo
re: clean all

#Logs para debuggeo

logs:
	@echo "$(BLUE)==> Mostrando logs en tiempo real... (Ctrl+C para salir)$(NC)"
	@$(COMPOSE_CMD) logs -f

logs-%:
	@echo "$(BLUE)==> Logs $* (Ctrl+C para salir)...$(NC)"
	@$(COMPOSE_CMD) logs -f $*

#Status para ver que hay encendido y como esta
status:
	@echo "$(GREEN)==> Estado actual de los servicios Docker:$(NC)"
	@docker ps  -a --filter name=backend \
				-a --filter name=blockchain \
				#-a --filter name=chat \
				-a --filter name=frontend \
				-a --filter name=game \
				-a --filter name=waf

# dev:
# 	@$(MAKE) MODE=true $(filter-out dev,$(MAKECMDGOALS))

# NUEVO: Dummy targets para que make no intente ejecutarlos dos veces
%:
    @:

dev-fast:
	@$(MAKE) MODE=true SCALE_WAF=0 $(filter-out dev-fast,$(MAKECMDGOALS))

# # Dev sin construir el WAF (útil después de un prune)
# dev-no-waf: excecute_scripts
# 	@echo "$(GREEN)==> Iniciando servicios SIN construir WAF...$(NC)"
# 	@docker compose -f $(DEV_FILE) up -d vault backend frontend filebeat game blockchain prometheus grafana elasticsearch logstash kibana
# 	@echo "$(GREEN)==> Servicios iniciados (WAF omitido)$(NC)"

help:
	@echo "$(BLUE)Targets disponibles:$(NC)"
	@echo "  all              - Iniciar todos los servicios"
	@echo "  logs             - Ver logs de todos los servicios"
	@echo "  logs-<servicio>  - Ver logs de un servicio específico"
	@echo "  monitor-logstash - Monitor visual de pipelines Logstash"
	@echo "  status           - Ver estado de los contenedores"
	@echo "  dev              - Modo desarrollo"
	@echo "  clean            - Limpiar contenedores"
	@echo "  fclean           - Limpieza completa"


.PHONY: all excecute_scripts create_certs delete_certs up down set_host remove_host clean fclean prune re logs logstash kibana status dev dev-fast dev-no-waf help


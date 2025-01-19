# KoBuddy

KoBuddy is a tool that helps visualizing your KoReader reading statistics and more.

# Run via docker-compose

1. Edit the port exposed in docker-compose
2. Run `docker compose up -d`
3. Run database migrations using `docker exec kobuddy sh -c "npm run --prefix server knex migrate:latest"`

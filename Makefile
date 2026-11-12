.PHONY: install dev check build preview format

web/%:
	@$(MAKE) --no-print-directory -C apps/web $*

install:
	npm ci

dev: web/dev

check:
	npx prettier --check .
	npx eslint .
	@$(MAKE) --no-print-directory web/check

build: web/build

preview: web/preview

format:
	npx prettier --write .
	npx eslint . --fix

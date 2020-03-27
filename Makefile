.DEFAULT_GOAL := help
.PHONY : help ALL clean help wrangle build

help:
	@echo 'Run `make ALL` to do things from scratch'

clean:
	@echo Put cleaning code here...



ALL: collect build

build: fuse wrangle publish build_jekyll

collect:
	./backend/scripts/collect/collect_example.py

fuse: backend/data/collected
	./backend/scripts/fuse/fuse_example.py

wrangle: backend/data/fused
	./backend/scripts/wrangle/wrangle_example.py

publish: wrangle backend/data/wrangled
	./backend/scripts/publish/publish_example.py



# this task builds out the jekyll site and imports it to the github pages docs/
build_jekyll:
	cd jekylldir && bundle exec jekyll build --incremental
	rsync -arv --checksum jekylldir/_site/ docs

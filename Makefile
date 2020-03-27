.DEFAULT_GOAL := help
.PHONY : help ALL clean help build

help:
	@echo 'Run `make ALL` to do things from scratch'



ALL: collect build

build: fuse data_wrangle data_sited build_jekyll

# push to github pages only the docs/ directory
publish: build
	git add docs/
	git commit -m "Github Pages, update: $$(date)" && git push


### cleaning stuff

clean:
	@echo Put cleaning code here...



# cofuwrap
collect:
	./backend/scripts/collect/collect_example.py

# non online steps
data_wrangle: fuse wrangle wrap

fuse: backend/data/collected/
	./backend/scripts/fuse/fuse_example.py

wrangle: backend/data/fused/
	./backend/scripts/wrangle/wrangle_example.py


wrap: backend/data/wrangled/
	./backend/scripts/wrap/wrap_example.py

# this task moves the wrangle/wrapped data to the jekyll installation
data_sited: backend/data/wrapped/
	mkdir -p jekylldir/_data jekylldir/static/data

	cp backend/data/wrapped/example/*.* jekylldir/_data
	cp backend/data/wrapped/example/*.* jekylldir/static/data

# this task builds out the jekyll site and imports it to the github pages docs/
build_jekyll:
	cd jekylldir && bundle exec jekyll build --incremental
	rsync -arv --checksum jekylldir/_site/ docs

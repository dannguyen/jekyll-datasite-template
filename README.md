# Jekyll Data Static Site Generator

sometimes you have a data project that doesn't require a database or anything non-static. Wouldn't it be nice to have a folder for the data ETL process, and a folder for the jekyll site generation, and one make task to create a jekyll site?


(just a draft of a mess, don't look into this too seriously)


## Getting started

Clone the repo

### Running the data etl

The data extraction-transformation-loading stuff is all in the [./backend/](./backend) directory. This template comes with an example project to show how I envision using it.

The project root directory contains a [Makefile](Makefile) with some handy shortcuts to run the ETL steps:

```sh
# collect, i.e. download and save fresh copies of the data files from online
$ make collect

# fuse, i.e. collate the raw collected data
$ make fuse

# wrangle, i.e. filter/transform the data into a usable form
$ make wrangle

# publish, i.e. any additional steps to make front-facing data, e.g. changing it to JSON, splitting it up into separate files, etc
$ make publish
```



Note: the [Makefile](Makefile) is in the **root** of the dataproject, because some make tasks involve building the jekyll site, which includes moving stuff from [backend/data](backend/data) to `jekylldir/static/data` and `jekylldir/_data`


### Previewing the site

Preview the jekyll site with:

```sh
$ cd jekylldir
$ bundle exec jekyll s
```

And visit it in your browser: http://127.0.0.1:4000/jekyll-datasite-template/

### Building the site for Github pages

This project template assumes that you have set up Github pages to use the **docs/** directory.

Run this make task:

```
$ make build
```

Then git add/commit/push for the pages to go live, e.g.

https://dannguyen.github.io/jekyll-datasite-template/



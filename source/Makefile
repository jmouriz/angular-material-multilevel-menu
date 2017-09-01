PACKAGE := $(shell grep name ../package.json | head -1 | cut -d: -f2 | tr -d '" ,')
SOURCE := $(PACKAGE)
TARGET := ../$(PACKAGE).min

all: $(TARGET).js $(TARGET).css $(TARGET).html

$(TARGET).css: $(SOURCE).css
	@../node_modules/.bin/minify $< > $@

$(TARGET).html: $(SOURCE).html
	@../node_modules/.bin/minify $< > $@

$(TARGET).js: $(SOURCE).js
	@../node_modules/.bin/minify $< > $@

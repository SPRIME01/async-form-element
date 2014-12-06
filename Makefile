build: node_modules/ bower_components/

lint: node_modules/
	./node_modules/.bin/jshint *.js test/*.js

saucelabs: build lint
	node ./test/saucelabs.js

travis: saucelabs

bower_components/: node_modules/
	./node_modules/.bin/bower install

node_modules/:
	npm install

clean:
	rm -rf ./bower_components ./node_modules

.PHONY: build travis lint clean

install:
	npm install

debug:
	npm run compile

publish: build;
	npm publish

build: lint test;
	npm run build	

test:
	npm test

lint:
	npm run eslint .
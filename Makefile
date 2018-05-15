install:
	npm install

debug:
	npm run compile

publish: lint;
	npm publish

build: lint;
	npm run build	

test:
	npm test

lint:
	npm run eslint .
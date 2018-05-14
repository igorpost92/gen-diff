install:
	npm install

debug:
	npm run compile

publish: lint;
	npm publish

build: lint;
	npm run build	

lint:
	npm run eslint .
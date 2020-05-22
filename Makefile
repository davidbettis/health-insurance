default: release

release: check build

check:
	eslint src

build:
	yarn build

clean:
	rm -rf public dist

server:
	yarn start

deploy: clean release
	aws s3 sync dist ${HEALTHINSURANCE_S3}

local-deploy: clean release
	sudo rm -rf /Library/WebServer/Documents/health-insurance/* && sudo cp -R dist/* /Library/WebServer/Documents/health-insurance

FROM picolo-base

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /picolo && cp -a /tmp/node_modules /picolo

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /picolo/
COPY package.json picolo.sh cockroach run.js /picolo/
COPY abi /picolo/abi

ENV COCKROACH_CHANNEL=official-docker
ENV enoderpc=http://10.10.0.1:8545

ENTRYPOINT ["/picolo/picolo.sh"]

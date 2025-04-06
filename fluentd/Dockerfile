FROM fluent/fluentd:v1.14-1

# Install dependencies for plugins
USER root
RUN apk add --no-cache --update \
    build-base \
    ruby-dev \
    && gem install fluent-plugin-influxdb-v2 \
    && gem sources --clear-all \
    && apk del build-base ruby-dev \
    && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

# Create log directories with proper permissions
RUN mkdir -p /fluentd/log/access /fluentd/log/errors /fluentd/log/general && \
    chmod -R 777 /fluentd/log

USER fluent
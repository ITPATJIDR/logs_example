FROM fluent/fluentd:v1.14-1

# Install dependencies for plugins
USER root
RUN apk add --no-cache --update \
    build-base \
    ruby-dev \
    && gem install fluent-plugin-elasticsearch \
    && gem sources --clear-all \
    && apk del build-base ruby-dev \
    && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

# Copy configuration file
COPY fluent.conf /fluentd/etc/

USER fluent 
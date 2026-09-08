FROM nginx:alpine

# Remove default Nginx website files and configs
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your frontend static assets
COPY . /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
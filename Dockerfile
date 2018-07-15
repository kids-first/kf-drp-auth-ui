FROM node:9 as builder
ENV NODE_ENV=development
ARG REACT_APP_API=http://localhost:5002
ARG REACT_APP_FACEBOOK_APP_ID=enter
ARG REACT_APP_GOOGLE_APP_ID=enter
ARG REACT_APP_DEFAULT_REDIRECT_URI=http://localhost:3001
RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

# Copy built app into nginx container
FROM nginx:1.13.5
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

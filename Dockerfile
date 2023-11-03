FROM node:16.13-alpine AS Production

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /capstone2

COPY package*.json ./

COPY . .

RUN npm ci


EXPOSE 3001

CMD ["npm", "start"]
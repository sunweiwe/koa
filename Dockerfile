FROM node:12



# 环境变量设置为生产环境
ENV NODE_ENV production
# Create app directory


COPY . /src

WORKDIR /src


RUN npm i

EXPOSE 8089

ENTRYPOINT ["node","./index.js"]
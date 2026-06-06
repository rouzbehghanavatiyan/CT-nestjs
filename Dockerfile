# استفاده از Node.js رسمی
FROM node:20-alpine

# دایرکتوری کاری در کانتینر
WORKDIR /usr/src/app

# کپی package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --production

# کپی باقی فایل‌های پروژه
COPY . .

# اگر NestJS با TypeScript است، قبل از اجرا باید build شود
RUN npm run build

# پورت پیش‌فرض NestJS
EXPOSE 3000

# دستور اجرا
CMD ["node", "dist/main.js"]

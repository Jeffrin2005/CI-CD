FROM node:20-alpine


WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# 5. Expose the frontend port (e.g., 3000 or 5173 for Vite)
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

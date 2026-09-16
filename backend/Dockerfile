# 1. Use the official Node.js image as a base
FROM node:20-alpine


# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your backend code
COPY . .

# 5. Expose the port your backend runs on (e.g., 5000)
EXPOSE 5000

# 6. The command to start your app
CMD ["npm", "start"]

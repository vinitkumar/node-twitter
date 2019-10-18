FROM node:11.12.0

WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
ENV SECRET='abadjadjadja1223232412424'
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 8080

# Wait 10 seconds before mongodb is ready
#CMD sleep 10 && npm start

#HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1
CMD [ "node", "server.js" ]
# Use Ubuntu 16.04 image as the base
FROM ubuntu:16.04

# if you don't have gcc(i think you do) run this
# RUN apt-get update && apt-get install -y \
#     gcc \
#     && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl build-essential apt-transport-https ca-certificates gnupg

#Install NodeJs
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |  gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

ENV NODE_MAJOR=16
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" |  tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y --allow-unauthenticated


RUN apt-get install git -y --allow-unauthenticated
RUN rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /docker

# clone the project to work folder
RUN git clone 'https://github.com/COSE451-KTKL/blackboard.git' .

#download dependencies
RUN npm install

#make env var
ENV MONGO_URL="mongodb+srv://baekgyu:baekgyu@blackboard.yt9eich.mongodb.net/?retryWrites=true&w=majority" COOKIE_SECRET="COOKIE_SECRET=Blackboard_Secret" 

# make the exe files from the c file => you can find what c file is use in what exe file
RUN gcc -z execstack -fno-stack-protector -z norelro -g -O0 ./src/controllers/saveQuizSubmit.c -o ./src/controllers/saveQuizSubmit
RUN gcc -z execstack -fno-stack-protector -z norelro -g -O0 ./src/controllers/saveProfQuiz.c -o ./src/controllers/saveProfQuiz
RUN gcc -z execstack -fno-stack-protector -z norelro -g -O0 ./src/controllers/saveNotice.c ./src/controllers/uploadNotice.c -o ./src/controllers/saveNotice -I ./src/controllers/
RUN gcc -z execstack -fno-stack-protector -z norelro -g -O0 ./src/controllers/Login.c -o ./src/controllers/login


# Your application port, change if it's different
EXPOSE 4000


CMD ["npm" ,"run", "start_server"]

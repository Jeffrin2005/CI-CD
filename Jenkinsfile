pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
    }

    stages {

        stage('Build & Push Backend') {
            steps {
                script {
                    echo "Building backend..."

                    sh "docker build -t jeffrinjojo/backend:${env.BUILD_ID} ./backend"

                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    sh "docker push jeffrinjojo/backend:${env.BUILD_ID}"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    echo "Building frontend..."

                    sh "docker build -t jeffrinjojo/frontend:${env.BUILD_ID} ./frontend"

                    sh "docker push jeffrinjojo/frontend:${env.BUILD_ID}"
                }
            }
        }
    }
}
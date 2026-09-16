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

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    echo "Updating Kubernetes image tags..."

                    sh "sed -i 's|image: jeffrinjojo/backend:.*|image: jeffrinjojo/backend:${env.BUILD_ID}|' k8s/backend.yaml"

                    sh "sed -i 's|image: jeffrinjojo/frontend:.*|image: jeffrinjojo/frontend:${env.BUILD_ID}|' k8s/frontend.yaml"

                    sh "git diff"
                }
            }
        }
    }
}
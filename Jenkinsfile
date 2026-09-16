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
    post {
        success {
            mail to: 'jeffrinjojo1@gmail.com',
                 subject: "Jenkins Build Successful: ${currentBuild.fullDisplayName}",
                 body: "Good news! Image version ${env.BUILD_ID} was built successfully and pushed. ArgoCD will deploy it shortly."
        }
        failure {
            mail to: 'jeffrinjojo1@gmail.com',
                 subject: "Jenkins Build Failed: ${currentBuild.fullDisplayName}",
                 body: "Uh oh! The build failed. Please check Jenkins logs."
        }
    }
}

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

                    sh "sed -i 's|image: jeffrinjojo/backend:.*|image: jeffrinjojo/backend:${env.BUILD_ID}|' k8s/backend-deploy.yaml"

                    sh "sed -i 's|image: jeffrinjojo/frontend:.*|image: jeffrinjojo/frontend:${env.BUILD_ID}|' k8s/frontend-deploy.yaml"

                    echo "Updated Kubernetes manifests:"
                    sh "git diff -- k8s/backend-deploy.yaml k8s/frontend-deploy.yaml"
                }
            }
        }

        stage('Commit & Push Kubernetes Changes') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-push',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                        git config user.name "Jenkins"
                        git config user.email "jenkins@localhost"

                        git add k8s/backend-deploy.yaml k8s/frontend-deploy.yaml

                        git commit -m "Update Kubernetes images to build ${BUILD_ID}" || true

                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/Jeffrin2005/CI-CD.git HEAD:main
                    '''
                }
            }
        }
    }
}
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
    }

    stages {
        

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo "Starting SonarQube Code Analysis..."
                        // Since Jenkins is running in Docker, we can't easily volume-mount the workspace to another container
                        // So we download and run the SonarScanner natively in the Jenkins workspace!
                        sh """
                        if [ ! -d "sonar-scanner" ]; then
                            echo "Downloading SonarScanner..."
                            curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                            unzip -qo sonar-scanner.zip
                            mv sonar-scanner-5.0.1.3006-linux sonar-scanner
                        fi
                        
                        ./sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=mern-app \
                            -Dsonar.sources=./frontend/src,./backend \
                            -Dsonar.host.url=http://host.docker.internal:9000 \
                            -Dsonar.login=\${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

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
                        
                        git rebase --abort || true
                        git pull --rebase https://${GIT_USER}:${GIT_TOKEN}@github.com/Jeffrin2005/CI-CD.git main
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/Jeffrin2005/CI-CD.git HEAD:main
                    '''
                }
            }
        }
    }
}

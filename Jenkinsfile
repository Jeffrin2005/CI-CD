pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
        
        // Add your SonarQube token to Jenkins credentials
        SONAR_TOKEN = credentials('sonar-login-token')
        SONAR_HOST = "http://host.docker.internal:9000"
    }

    stages {
        
        // 🔒 NEW: SONARQUBE CODE QUALITY SCAN
        stage('SonarQube Security Scan') {
            steps {
                script {
                    echo "Scanning source code for bugs and hardcoded secrets..."
                    sh """
                    docker run --rm \
                        -e SONAR_HOST_URL="${SONAR_HOST}" \
                        -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=mern-project" \
                        -e SONAR_TOKEN="${SONAR_TOKEN}" \
                        -v \${WORKSPACE}:/usr/src \
                        sonarsource/sonar-scanner-cli
                    """
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    echo "Building backend..."
                    sh "docker build -t jeffrinjojo/backend:${env.BUILD_ID} ./backend"
                    
                    // 🔒 NEW: TRIVY SCAN BACKEND IMAGE
                    echo "Scanning Backend Image with Trivy..."
                    sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        jeffrinjojo/backend:${env.BUILD_ID}
                    """

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
                    
                    // 🔒 NEW: TRIVY SCAN FRONTEND IMAGE
                    echo "Scanning Frontend Image with Trivy..."
                    sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        jeffrinjojo/frontend:${env.BUILD_ID}
                    """

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

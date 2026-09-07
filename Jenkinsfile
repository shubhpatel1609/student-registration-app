pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds-v2')
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/student-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/student-frontend"
        BUILD_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    bat "docker build -t %BACKEND_IMAGE%:%BUILD_TAG% -t %BACKEND_IMAGE%:latest ."
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    bat "docker build -t %FRONTEND_IMAGE%:%BUILD_TAG% -t %FRONTEND_IMAGE%:latest ."
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                bat "docker login -u %DOCKERHUB_CREDENTIALS_USR% -p %DOCKERHUB_CREDENTIALS_PSW%"
                bat "docker push %BACKEND_IMAGE%:%BUILD_TAG%"
                bat "docker push %BACKEND_IMAGE%:latest"
                bat "docker push %FRONTEND_IMAGE%:%BUILD_TAG%"
                bat "docker push %FRONTEND_IMAGE%:latest"
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    bat """
                    ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" %SSH_USER%@65.2.161.62 "cd student-registration-app && git pull && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"
                    """
                }
            }
        }
    }

    post {
        always {
            bat "docker logout"
        }
        success {
            echo "Build ${BUILD_TAG} deployed successfully!"
        }
        failure {
            echo "Build failed — check logs."
        }
    }
}
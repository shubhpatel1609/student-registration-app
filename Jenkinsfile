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
                bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
                bat "docker push %BACKEND_IMAGE%:%BUILD_TAG%"
                bat "docker push %BACKEND_IMAGE%:latest"
                bat "docker push %FRONTEND_IMAGE%:%BUILD_TAG%"
                bat "docker push %FRONTEND_IMAGE%:latest"
            }
        }
    }

    post {
        always {
            bat "docker logout"
        }
        success {
            echo "Build ${BUILD_TAG} pushed to Docker Hub successfully!"
        }
        failure {
            echo "Build failed — check logs."
        }
    }
}
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build and Push Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        def frontendImage = docker.build("omardibba/crowdfunding-frontend:${BUILD_NUMBER}")
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                            frontendImage.push()
                            frontendImage.push('latest')
                        }
                    }
                }
            }
        }
        stage('Test Smart Contracts') {
            steps {
                dir('blockchain') {
                    sh 'yarn install'
                    sh 'yarn test'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}

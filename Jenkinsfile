pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'yarn install'
                    sh 'yarn build'
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
        
        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.build("omardibba/crowdfunding-frontend:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("omardibba/crowdfunding-frontend:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl set image deployment/frontend frontend=omardibba/crowdfunding-frontend:${env.BUILD_NUMBER}"
            }
        }
    }
    
    post {
        success {
            echo 'Build successful! Notify team...'
        }
        failure {
            echo 'Build failed! Notify team...'
        }
    }
}
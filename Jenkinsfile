pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
        DOCKER_REGISTRY = "localhost:5000"  // Changed from host.docker.internal to localhost
    }
    
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
        
        stage('Deploy Smart Contract') {
            steps {
                dir('blockchain') {
                    withCredentials([
                        string(credentialsId: 'polygon-amoy-rpc-url', variable: 'POLYGON_AMOY_RPC_URL'),
                        string(credentialsId: 'polygon-private-key', variable: 'PRIVATE_KEY')
                    ]) {
                        sh 'yarn install'
                        sh 'echo "PRIVATE_KEY=$PRIVATE_KEY" > .env'
                        sh 'echo "POLYGON_AMOY_RPC_URL=$POLYGON_AMOY_RPC_URL" >> .env'
                        sh 'npx hardhat compile'
                        sh 'npx hardhat run scripts/deploy.js --network polygon_amoy'
                    }
                }
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        def imageName = "${DOCKER_REGISTRY}/crowdfunding-frontend:${BUILD_NUMBER}"
                        
                        // Build the Docker image
                        sh "docker build -t ${imageName} ."
                        
                        // Attempt to push the image, with retry logic
                        retry(3) {
                            try {
                                sh "docker push ${imageName}"
                            } catch (Exception e) {
                                echo "Push failed, retrying..."
                                sleep 10 // Wait for 10 seconds before retrying
                                throw e // Rethrow the exception to trigger a retry
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh 'rm -f $KUBECONFIG'
        }
    }
}
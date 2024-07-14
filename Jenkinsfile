pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
        DOCKER_REGISTRY = "host.docker.internal:5000"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Docker Registry Diagnostics') {
            steps {
                sh 'docker info'
                sh 'docker ps | grep registry || true'
                sh 'curl -v http://${DOCKER_REGISTRY}/v2/ || true'
            }
        }
        
        stage('Ensure Docker Registry is Accessible') {
            steps {
                script {
                    sh '''
                    if ! curl -s -f http://${DOCKER_REGISTRY}/v2/ > /dev/null; then
                        echo "Cannot access Docker registry at ${DOCKER_REGISTRY}"
                        echo "Please ensure the registry is running and accessible"
                        exit 1
                    fi
                    '''
                }
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
            sh 'docker images'
            sh 'docker ps -a'
        }
    }
}
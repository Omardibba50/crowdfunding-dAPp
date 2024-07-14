pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
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
                    sh 'docker build -t localhost:5000/crowdfunding-frontend:${BUILD_NUMBER} .'
                    sh 'docker push localhost:5000/crowdfunding-frontend:${BUILD_NUMBER}'
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG
                        
                        echo "Kubectl version:"
                        kubectl version --client
                        
                        echo "Applying Kubernetes manifests:"
                        envsubst < k8s/deployment.yaml | kubectl apply -f -
                        kubectl apply -f k8s/service.yaml
                        
                        echo "Waiting for deployment to be ready:"
                        kubectl rollout status deployment/crowdfunding-frontend
                        
                        echo "Checking pods:"
                        kubectl get pods
                        
                        echo "Checking services:"
                        kubectl get services
                        
                        echo "Service URL:"
                        minikube service crowdfunding-frontend --url
                    '''
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
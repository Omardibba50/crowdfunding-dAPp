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
            sh 'yarn install'
            sh 'npx hardhat compile'
            withCredentials([
                string(credentialsId: 'polygon-amoy-rpc-url', variable: 'POLYGON_AMOY_RPC_URL'),
                string(credentialsId: 'polygon-private-key', variable: 'PRIVATE_KEY')
            ]) {
                sh 'npx hardhat run scripts/deploy.js --network polygon_amoy'
            }
        }
    }
}
        
        stage('Build and Push Docker Image') {
            steps {
                sh 'docker build -t localhost:5000/crowdfunding-frontend:${BUILD_NUMBER} frontend/.'
                sh 'docker push localhost:5000/crowdfunding-frontend:${BUILD_NUMBER}'
            }
        }
        
        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'kubectl --kubeconfig $KUBECONFIG apply -f k8s/'
                    sh 'kubectl --kubeconfig $KUBECONFIG set image deployment/crowdfunding-frontend crowdfunding-frontend=localhost:5000/crowdfunding-frontend:${BUILD_NUMBER}'
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
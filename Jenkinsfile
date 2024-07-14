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
       
    }
    
    post {
        always {
            sh 'rm -f $KUBECONFIG'
        }
    }
}
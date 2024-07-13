pipeline {
    agent {
        kubernetes {
            yaml '''
                apiVersion: v1
                kind: Pod
                metadata:
                  name: crowdfunding-builder
                spec:
                  serviceAccountName: crowdfunding-ksa
                  containers:
                  - name: cloud-sdk
                    image: google/cloud-sdk:latest
                    command:
                    - cat
                    tty: true
                  - name: docker
                    image: docker:latest
                    command:
                    - cat
                    tty: true
                    volumeMounts:
                    - name: docker-sock
                      mountPath: /var/run/docker.sock
                  - name: node
                    image: node:14
                    command:
                    - cat
                    tty: true
                  volumes:
                  - name: docker-sock
                    hostPath:
                      path: /var/run/docker.sock
            '''
        }
    }
    environment {
        PROJECT_ID = 'botma-chatbot'
        CLUSTER_NAME = 'crowdfunding-cluster'
        LOCATION = 'us-central1-a'
        POLYGON_PRIVATE_KEY = credentials('polygon-private-key')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Frontend') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'yarn install'
                        sh 'yarn build'
                    }
                }
            }
        }
        stage('Deploy Smart Contract') {
            steps {
                container('node') {
                    dir('blockchain') {
                        sh 'yarn install'
                        sh 'npx hardhat compile'
                        sh 'npx hardhat run scripts/deploy.js --network polygon'
                    }
                }
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                container('cloud-sdk') {
                    sh "gcloud auth configure-docker gcr.io -q"
                    sh "docker build -t gcr.io/${PROJECT_ID}/crowdfunding-frontend:${env.BUILD_NUMBER} frontend/."
                    sh "docker push gcr.io/${PROJECT_ID}/crowdfunding-frontend:${env.BUILD_NUMBER}"
                }
            }
        }
        stage('Deploy to GKE') {
            steps {
                container('cloud-sdk') {
                    sh "gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${LOCATION} --project ${PROJECT_ID}"
                    sh "kubectl set image deployment/crowdfunding-frontend crowdfunding-frontend=gcr.io/${PROJECT_ID}/crowdfunding-frontend:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}
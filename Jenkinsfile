pipeline {
    agent any

    tools {
       nodejs 'nodejs-21.6.2'
    }

    environment {
        DOCKER_TOOL_NAME = 'docker-26.0.0'
        DOCKER_IMAGE = 'asia-northeast3-docker.pkg.dev/bubbly-enigma-423300-m7/gar-io/travellog'
        SKIP_PREFLIGHT_CHECK = 'true'
    }

    stages {
        stage('Build') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Building......'
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Testing...'
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('travellog') {
                    script {
                        docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcp-jenkins-gar-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh '''#!/bin/bash
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet
                        docker push ${DOCKER_IMAGE}:${BUILD_ID}
                        '''
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig([credentialsId: 'k8s-jenkins-token', serverUrl: 'https://10.0.0.3', namespace: 'default']) {
                        sh 'kubectl apply -f travellog/deploy.yaml'
                    }
                }
            }
        }
    }
}

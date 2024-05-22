pipeline {
    agent any

    tools {
       nodejs 'nodejs-21.6.2'
    }

    environment {
        DOCKER_TOOL_NAME = 'docker-26.0.0'
        DOCKER_IMAGE = 'asia-northeast3-docker.pkg.dev/bubbly-enigma-423300-m7/gar-io/travellog-frontend'
        SKIP_PREFLIGHT_CHECK = 'true'
    }

    stages {
        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Frontend Building......'
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Frontend Test') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Frontend Testing...'
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}", '--no-cache .')
                        sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_ID} ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
        stage('Push Frontend Docker Image') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcp-jenkins-gar-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh '''#!/bin/bash
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet
                        docker push ${DOCKER_IMAGE}:${BUILD_ID}
                        docker push ${DOCKER_IMAGE}:latest
                        '''
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                dir('cicd') {
                    script {
                        withKubeConfig([credentialsId: 'k8s-jenkins-token', serverUrl: 'https://10.0.0.3', namespace: 'frontend-ns']) {
                            sh '''
                            if kubectl get deployment frontend-app -n frontend-ns; then
                                kubectl set image deployment/frontend-app frontend=${DOCKER_IMAGE}:${BUILD_ID} -n frontend-ns --record
                            else
                                kubectl apply -f frontend-deploy.yaml
                            fi
                            '''
                        }
                    }
                }
            }
        }
    }
}

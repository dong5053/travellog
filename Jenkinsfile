pipeline {
    agent any

    tools {
        nodejs 'nodejs-21.6.2'
    }

    environment {
        DOCKER_TOOL_NAME = 'docker-26.0.0'
        FRONTEND_IMAGE = 'asia-northeast3-docker.pkg.dev/bubbly-enigma-423300-m7/gar-io/travellog-frontend'
        BACKEND_IMAGE = 'asia-northeast3-docker.pkg.dev/bubbly-enigma-423300-m7/gar-io/travellog-backend'
        SKIP_PREFLIGHT_CHECK = 'true'
    }

    stages {
        stage('Backend Build and Test') {
            steps {
                dir('backend') {
                    script {
                        echo 'Backend Building and Testing......'
                        // Use Docker to build and test the backend
                        docker.image('python:3.8').inside('-u root:root') {
                            sh '''
                            pip install --user -r requirements.txt
                            python back_jango/manage.py test
                            '''
                        }
                    }
                }
            }
        }
        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}", '--no-cache .')
                        sh "docker tag ${BACKEND_IMAGE}:${env.BUILD_ID} ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }
        stage('Push Backend Docker Image') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcp-jenkins-gar-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh '''#!/bin/bash
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet
                        docker push ${BACKEND_IMAGE}:${BUILD_ID}
                        docker push ${BACKEND_IMAGE}:latest
                        '''
                    }
                }
            }
        }
        stage('Deploy Backend to Kubernetes') {
            steps {
                dir('cicd') {
                    script {
                        withKubeConfig([credentialsId: 'k8s-jenkins-token', serverUrl: 'https://10.0.0.3', namespace: 'backend-ns']) {
                            sh '''
                            if kubectl get namespace backend-ns; then
                                echo "Namespace backend-ns already exists"
                            else
                                kubectl apply -f 1-TravelLog-Namespace.yaml
                            fi
                            if kubectl get deployment django-deployment -n backend-ns; then
                                kubectl set image deployment/django-deployment django-backend=${BACKEND_IMAGE}:${BUILD_ID} -n backend-ns --record
                            else
                                kubectl apply -f service.yaml
                                kubectl apply -f backend-config.yaml
                                kubectl apply -f backend-secret.yaml
                                kubectl apply -f backend-deploy.yaml
                                kubectl apply -f backend-svc-proxy.yaml
                                kubectl apply -f TravelLog-Ingress.yaml
                                kubectl apply -f clusterissuer.yaml
                            fi
                            '''
                        }
                    }
                }
            }
        }
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
                        docker.build("${FRONTEND_IMAGE}:${env.BUILD_ID}", '--no-cache .')
                        sh "docker tag ${FRONTEND_IMAGE}:${env.BUILD_ID} ${FRONTEND_IMAGE}:latest"
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
                        docker push ${FRONTEND_IMAGE}:${BUILD_ID}
                        docker push ${FRONTEND_IMAGE}:latest
                        '''
                    }
                }
            }
        }
        stage('Deploy Frontend to Kubernetes') {
            steps {
                dir('cicd') {
                    script {
                        withKubeConfig([credentialsId: 'k8s-jenkins-token', serverUrl: 'https://10.0.0.3', namespace: 'frontend-ns']) {
                            sh '''
                            if kubectl get namespace frontend-ns; then
                                echo "Namespace frontend-ns already exists!"
                            else
                                kubectl apply -f 1-TravelLog-Namespace.yaml
                            fi
                            if kubectl get deployment frontend-app -n frontend-ns; then
                                kubectl set image deployment/frontend-app frontend=${FRONTEND_IMAGE}:${BUILD_ID} -n frontend-ns --record
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
    post {
        always {
            script {
                echo 'Cleaning up unused Docker images....'
                sh '''
                docker image prune -af
                
                IMAGES=\$(docker images -q)
        
                if [ -n "\$IMAGES" ]; then
                    docker rmi \$IMAGES
                else
                    echo "No images to remove"
                fi
                '''
            }
        }
    }
}

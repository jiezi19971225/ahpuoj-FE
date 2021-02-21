pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'autoDeploy', defaultValue: true, description: '是否自动部署到服务器')
    }

    stages {
        stage('build'){
            steps {
              echo 'fetch source code'
              git 'https://github.com/jiezi19971225/ahpuoj-FE'
              echo 'start build image'
              script{
                docker.withRegistry('https://ccr.ccs.tencentyun.com', 'dockerAccount') {
                  def customImage = docker.build("ccr.ccs.tencentyun.com/jiezi19971225/ahpuoj-fe")
                  customImage.push()
                  customImage.push("v${env.BUILD_NUMBER}")
                }
              }
            }
        }
        stage('deploy'){
          when {
            expression { params.autoDeploy == true }
          }
          steps {
            echo 'start deploy to school oj server'
            sshPublisher(publishers: [sshPublisherDesc(
              configName: 'schoolOJ', 
              transfers: [sshTransfer(
                cleanRemote: false, 
                excludes: '', 
                execCommand: '''
echo "开始构建后操作"
cd /home/ahpuoj/ahpuojDocker/compose
cat > docker-compose.tmp.yml<<EOF
version: "3.2"
services:
  fe:
    image: ccr.ccs.tencentyun.com/jiezi19971225/ahpuoj-fe:v${BUILD_NUMBER}
    container_name: ahpuojv2_fe
    restart: always
    ports:
      - 80:80
    volumes:
      - oj-upload-volume:/usr/share/nginx/ahpuoj/upload:ro
EOF
docker-compose -f docker-compose.yml -f docker-compose.tmp.yml pull fe
docker-compose -f docker-compose.yml -f docker-compose.tmp.yml up -d fe
docker image prune -f --filter "dangling=true"
                ''', 
                execTimeout: 120000,
                flatten: false, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: '/home/ahpuoj/ahpuojDocker/compose', 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: '')], 
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: false)])
          }
        }
    }
    post {
        always {
            echo '🎉 done!!! 🎉'
        }
    }
}
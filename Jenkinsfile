nodeModulePipeline {
   name = "prod-stockholm"
   squad = "stockholm"
   channel = "#prod-stockholm-build"
  if (this.env.BRANCH_NAME == 'master') {
      buildScript = "./build.sh"
      triggerDownstream = 'squad-storefront/prod-stockholm-bootstrap/master'
      wait4Downstream = false
  } else {
      buildScript = "npm install && npm run build && npm run copy-e2e && npm run test-jenkins"
  }
   skipSonarQubeScan = true
   skipDeployment = true
   skipValidation = true   
}

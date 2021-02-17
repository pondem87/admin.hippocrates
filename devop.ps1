$mode = $args[0]
Write-Host 'Pfitzmaster devop script started...'

if ($mode -eq 'dev-mode') {
    Write-Host 'Switching to development environment.'

    Write-Host 'Setting up variables.js'
    Copy-Item .\devop\dev_vars.txt .\src\variables.js

    Write-Host 'Starting development server'
    npm start

} elseif ($mode -eq 'deploy') {
    Write-Host 'Deploying production version.'

    Write-Host 'Setting up variables.js'
    Copy-Item .\devop\prod_vars.txt .\src\variables.js

    Write-Host 'Building the React production build.'
    npm run-script build

    Write-Host 'Syncing with AWS S3 Bucket.'
    aws s3 sync build/ s3://admin.hippocratesalliance.com/ --delete --profile laroyaume

    Write-Host 'Deployment complete....'
    Write-Host 'Invalidating cloufront distribution.'
    aws cloudfront create-invalidation --distribution-id E2RKKW2ERQI1W4 --paths "/*"

    Write-Host 'Done! Exiting script...'

} else {
    Write-Host 'Unknown Command... Exiting script'
}
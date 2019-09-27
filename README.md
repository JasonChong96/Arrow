# Arrow

<div style="text-align:center"><img src="https://i.imgur.com/cSBi0Ik.png" /></div>

Arrow is a progressive web application that maximises group productivity through a collaborative project timeline that provides full visibility of tasks demands while encouraging team accountability.

[Access the application through this link.](https://jasonchong96.github.io/Arrow "Arrow")

Note: We are using heroku free tier to host our back-end so requests might time out as the back-end takes time to start up. It goes down when it's idle.

## Quick Start
```
npm install
npm start
```

## Deployment
```
npm run build
npm run ghdeploy
```
Remember to change URL in package.json

## Troubleshooting
### Error 404 when running webpack on windows
In paths.js, change
```
publicPath: resolvePath('/'),
```
to
```
publicPath: '/',
```
%CD%
IF EXIST node_modules (
start chrome --app="%CD%\public\index.html
) ELSE (
npm install
)
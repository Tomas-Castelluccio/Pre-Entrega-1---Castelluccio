const {port, app} = require('./src/app')

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
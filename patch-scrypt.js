const replace = require('replace-in-file')
const options = {
  files: './node_modules/scrypt/index.js',
  from: /\.\/build\/Release\/scrypt/g,
  to: 'scrypt'
}

replace(options)
  .then(results => {
    console.log('Replacement results:', results)
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })

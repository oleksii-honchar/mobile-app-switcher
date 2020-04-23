process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''

process.on('unhandledRejection', err => {
  throw err
})

const jest = require('jest')
let argv = process.argv.slice(2)

if (argv.indexOf('--coverage') < 0) {
  argv.push('--watch')
}

jest.run(argv)

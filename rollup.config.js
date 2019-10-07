import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'


const info = require('./package.json')

const config = {
  entry: 'src/htmlcomponent.js',
  plugins: [
    resolve(),
    babel(),
    uglify()
  ],
  targets: [
    {
      dest: info.main,
      format: 'umd',
      moduleName: 'htmlcomponent'
    }, {
      dest: info.module,
      format: 'es'
    }
  ]
}

export default config

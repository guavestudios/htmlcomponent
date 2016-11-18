import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/htmlcomponent.js',
  format: 'umd',
	moduleName: 'htmlcomponent',
  dest: 'dist/htmlcomponent.min.js',
	plugins: [
		uglify()
	]
};

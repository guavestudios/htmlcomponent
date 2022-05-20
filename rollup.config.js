import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/htmlcomponent.js',
	output: {
		file: 'dist/htmlcomponent.min.js',
		format: 'umd',
		name: 'htmlcomponent'
	},
	plugins: [
		terser()
	]
};

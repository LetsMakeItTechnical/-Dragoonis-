module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	coverageDirectory: './coverage',
	testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: './junit',
				outputName: 'backend.xml'
			}
		]
	],
	transformIgnorePatterns: ['^.+\\.js$'],
	coverageReporters: ['text', 'lcov', 'text-summary'],
	testMatch: ['**/*.test.ts'],
	moduleDirectories: ['node_modules', 'src'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: {
		'^.+\\.(js|ts|)$': 'ts-jest'
	},
	collectCoverage: false,
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
};

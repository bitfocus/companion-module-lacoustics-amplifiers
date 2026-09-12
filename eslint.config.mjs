import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...baseConfig,
	{
		files: ['vitest.config.ts', '**/*.spec.ts', 'src/__tests__/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json'],
			},
		},
		rules: {
			// Test-only imports; they are devDependencies and never shipped
			'n/no-unpublished-import': 'off',
		},
	},
]

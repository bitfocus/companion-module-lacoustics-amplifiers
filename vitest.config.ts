import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		typecheck: {
			// Type-level assertions, for things a runtime test cannot catch —
			// a config field typed as a literal instead of its real range, say.
			enabled: true,
			include: ['src/**/*.spec-d.ts'],
			tsconfig: './tsconfig.json',
		},
		coverage: {
			provider: 'v8',
			// text for the CI log, lcov for Codecov, html for browsing locally
			reporter: ['text', 'lcov', 'html'],
			reportsDirectory: './coverage',
			include: ['src/**/*.ts'],
			exclude: [
				// Tests and the fixture helpers beside them, not shipped code
				'src/__tests__/**',
				// Type-only modules, no runtime code to exercise
				'src/types.ts',
			],
		},
	},
})

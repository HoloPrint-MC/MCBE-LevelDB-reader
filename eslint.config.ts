import js from "@eslint/js";
import { defineConfig } from "eslint/config";
// @ts-expect-error: no types for this one
import importNewlines from "eslint-plugin-import-newlines";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{ ignores: ["dist/**/*", "node_modules/**/*", "src/LevelDb.js"] },
	...tseslint.configs.recommended,
	{
		files: ["**/*.{js,ts,mjs,cjs}"],
		plugins: {
			js,
			"simple-import-sort": simpleImportSort,
			"import-newlines": importNewlines
		},
		extends: ["js/recommended"],
		languageOptions: { globals: {
			...globals.browser,
			...globals.node 
		} },
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"import-newlines/enforce": ["error", { "items": 1 }],
			"quotes": ["error", "double"],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
			"semi": ["error", "always"],
			"curly": ["error", "all"],
			"space-before-function-paren": ["error", {
				"anonymous": "never",
				"named": "never",
				"asyncArrow": "always"
			}],
			"one-var": ["error", "never"],
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			"object-curly-spacing": ["error", "always"],
			"no-sequences": "error",
			"arrow-parens": ["error", "as-needed"],
			"comma-dangle": ["error", "never"],
			"object-curly-newline": ["error", {
				"consistent": true,
				"minProperties": 2
			}],
			"object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }],
			"brace-style": ["error", "1tbs"],
			"keyword-spacing": ["error", {
				"before": true,
				"after": false,
				overrides: {
					"return": { "after": true },
					"from": { "after": true },
					"else": { "after": true },
					"const": { "after": true },
					"import": { "after": true },
					"export": { "after": true },
					"default": { "after": true },
					"case": { "after": true },
					"of": { "after": true },
					"in": { "after": true },
					"try": { "after": true },
					"finally": { "after": true },
					"throw": { "after": true }
				}
			}]
		}
	}
]);

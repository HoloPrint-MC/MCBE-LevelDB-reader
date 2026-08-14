import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
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
			"import-newlines": importNewlines,
			"@stylistic": stylistic
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
			
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
			"curly": ["error", "all"],
			"one-var": ["error", "never"],
			"no-sequences": "error",
			"no-case-declarations": "error",
			
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/semi": "error",
			"@stylistic/space-before-function-paren": ["error", {
				"anonymous": "never",
				"named": "never",
				"asyncArrow": "always",
				"catch": "never"
			}],
			// "@stylistic/space-infix-ops": ["error", { "ignoreOperators": ["?", ":"] }],
			"@stylistic/indent": ["error", "tab", { "SwitchCase": 1 }],
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"@stylistic/comma-dangle": ["error", "never"],
			"@stylistic/object-curly-newline": ["error", {
				"consistent": true,
				"minProperties": 2
			}],
			"@stylistic/object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }],
			"@stylistic/brace-style": ["error", "1tbs"],
			"@stylistic/space-before-blocks": ["error", "always"],
			"@stylistic/keyword-spacing": ["error", {
				"before": true,
				"after": true,
				overrides: {
					"if": { "after": false },
					"for": { "after": false },
					"while": { "after": false }
				}
			}]
		}
	}
]);

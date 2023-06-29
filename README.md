# color-to-names

只需要根据一个hex或rgb颜色值，就可以将找出其对应的中英文颜色名，使用DeltaE算法计算色差，更符合人眼感知

## Features

- 支持多种模块 - CommonJS, ESM modules and IIFE
- Typed，用Typescript编写
- 使用DeltaE算法计算色差，更符合人眼感知
- 默认支持中英文颜色名，可扩展其他语言

## Usage

The starter contains the following scripts:

- `dev` - starts dev server
- `build` - generates the following bundles: CommonJS (`.cjs`) ESM (`.mjs`) and IIFE (`.iife.js`). The name of bundle is automatically taken from `package.json` name property
- `test` - starts vitest and runs all tests
- `test:coverage` - starts vitest and run all tests with code coverage report
- `lint:scripts` - lint `.ts` files with eslint
- `lint:styles` - lint `.css` and `.scss` files with stylelint
- `format:scripts` - format `.ts`, `.html` and `.json` files with prettier
- `format:styles` - format `.cs` and `.scss` files with stylelint
- `format` - format all with prettier and stylelint
- `prepare` - script for setting up husky pre-commit hook
- `uninstall-husky` - script for removing husky from repository

## Acknowledgment

If you found it useful somehow, I would be grateful if you could leave a star in the project's GitHub repository.

Thank you.

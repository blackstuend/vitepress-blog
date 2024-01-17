---
title: Set ESLint and Prettier Together with TypeScript in Vue.js
description: In my previous experiences, I often encountered conflicts when setting up ESLint and Prettier, mainly because both tools have settings related to code style, such as indentation, commas, etc. Resolving these conflicts requires an understanding of every setting in both linting tools.
tags: nodejs, frontend
---

# Set ESlint and prettier together with typescript in Vue.js
In my previous experiences, I often encountered conflicts when setting up ESLint and Prettier, mainly because both tools have settings related to code style, such as indentation, commas, etc. Resolving these conflicts requires an understanding of every setting in both linting tools.

## Prerequisite
For this demonstration, I will be using a Vite (Vue) project to set up ESLint with Airbnb's configuration along with Prettier.


## Create a vue project and choose the vue version
```
$ npm init vite@latest
```

## Install the eslint and prettier
```
$ npm install eslint eslint-plugin-prettier eslint-config-prettier @typescript-eslint/eslint-plugin eslint-config-airbnb-base eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue vue-eslint-parser
```

## Create the .eslintrc.cjs
Because I use the vite to create the project, and vite use the esbuild to build the project, so I need to use the .cjs file to set the eslint

```js
module.exports = {
  root: true,
  env: {
    browser: true, // browser global variables
    es2021: true, // adds all ECMAScript 2021 globals and automatically sets the ecmaVersion parser option to 12.
  },
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'plugin:prettier/recommended', // add prettier plugin at the end
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
```

## Create the .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2
}
```

* The extends array includes three settings. The first, vue3-recommended, sets the Vue 3 rules. The second, airbnb-base, applies Airbnb's base settings. The third and most crucial, prettier, adjusts the rules to resolve conflicts between ESLint and Prettier. Without this setting, conflicts would arise.

* The plugins array contains two settings. The first, @typescript-eslint, sets TypeScript rules. The second, prettier, utilizes your Prettier configuration, allowing Prettier to control code style while ESLint manages syntax errors.

* In the rules, the first line 'prettier/prettier': 'error' is vital. It treats Prettier errors as ESLint errors, enabling you to view Prettier issues in your ESLint error list for fixing. The other settings pertain to ESLint rules.

## Conclusion
* After integrating ESLint and Prettier, I no longer face conflicts between the two. I can use Prettier to format my code and ESLint to check for syntax errors. Prettier can also format CSS files and other file types, enabling me to standardize code formatting across my project. This integrated setup is, in my opinion, the best way to utilize ESLint and Prettier together.

* To see a demo, you can visit my GitHub [demo](https://github.com/blackstuend?tab=repositories)


## Reference
* https://blog.csdn.net/xs20691718/article/details/122727900
* https://www.npmjs.com/package/vue-eslint-parser
* https://github.com/prettier/eslint-plugin-prettier
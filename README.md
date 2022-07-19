# pnpm-monorepo-example

> Using pnpm to manage your monorepo with ease

## Step by step 

First install [pnpm](https://pnpm.io) globally 

```sh 
$ npm install -g pnpm 
```

Then just check it:

```sh 
$ pnpm --version
```

### Start from scratch 

Yup, start from scratch 

1. Create your project folder 

```sh 
$ mkdir awesome-monorepo && cd awesome-monorepo 
$ pnpm init
```

Just answer those question and generate a package.json

2. Next create the file structures

```sh 
$ mkdir packages && cd packages && mkdir module-a && mkdir module-b
```

Then cd into each of the `packages/*` folder and run `pnpm init` 

If you just keep press enter and you should ended up a package.json file like this 

```json 
{
  "name": "module-a",
  "version": "1.0.0",
  "description": "module a that is the library",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

Now we are going to change the name to `@awesome-monorepo/module-a`. And please do the same with `packages/module-b/package.json` 

3. Add `index.js` and write some code

Just very simple thing. In `packages/module-a/index.js`

```js 
// just use cjs 
module.exports = function add (x, y) {
    return x + y
}
```

In `packages/module-b/index.js` 

```js 
const add = require('@awesome-monorepo/module-a')

const result = add(1, 1)

console.log('The result of 1 + 1 is', result)
```

4. Move back to the root of your project

We need to add a file call `.npmrc`, and put this in there: 

```
shared-workspace-lockfile=false
shamefully-hoist=true
```

This file help pnpm to understand your project is a monorepo 

5. Linking things together 









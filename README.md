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

*I found the pnpm 7 doesn't require this anymore, but add it just on the safe side*

5. Linking things together 

Now on the root of your project

```sh
$ pnpm add @awesome-monorepo/module-a  --filter @awesome-monorepo/module-b 
```

What that means is, add `@awesome-monorepo/module-a` to `@awesome-monorepo/module-b` as depedencies. If you add `-D` it will add to the `devDependencies` 

Now add a line to the package.json on the root of your project 

```json 
{
    ...
    scripts: {
        'dev': 'node ./packages/module-b/index.js'
    }
    ...
}
```

Try it 

```sh
$ pnpm dev 
$ ... 
$ The result of 1 + 1 is 2
```

Working nicely! 

Now take a look at `packages/module-b/package.json` 
you should see this 

```json 
{
    "dependencies": {
        "@pnpm-monorepo-example/module-a": "workspace:^1.0.0"
    }
}
```

`pnpm` link your local `module-a` to your `module-b`. Now several things to know. 

* when you edit your file in your `module-a` and `module-b` will get it instancely, try it to change your `add` function see it happens
* If you change the version of `@awesome-monorepo/module-a` then you need to update the `module-b/package.json` accordingly 


--- 

## Extra bit 

Now try to add a depedencies to the project root. 

```sh
$ pnpm add chalk@4.1.2 
```

Then change your `packages/module-b/index.js` file to this 

```js
const chalk = require('chalk')
const add = require('@pnpm-monorepo-example/module-a')

const result = add(1, 1)

console.log(chalk.yellow(`The result of 1 + 1 is ${result}`))
```

Run `pnpm dev` again, and you should see the console output is now yellow (if its not then you need to cd into the folder and run it from there) 

What you just did is add share depedencies across the project. This is very useful if your packages has a lot of same `devDependencies`. You only need to add them all to the root level, and each packages will just work. 

--- 

Joel Chu (c) 2022

--- 

pnpm is much better than this [piece of crap](https://yarnpkg.com/) 







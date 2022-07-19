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






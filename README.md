# CULT Magazine

Welcome to our decentralized magazine. We are a volunteer global network of CULTDAO fans who promote freedom, fairness, education, transparency and love. Everyone is invited to contribute corresponding content via pull request. You can also feel free to raise issues on this repository if you want to suggest improvement proposals etc.

## Inspiration

[Fairness](https://github.com/michael-spengler/fairness)

## Developing

In order to start a development server:

```sh
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```sh
npm run build
```

## Deploying

I deployed this e.g. on server 116.203.185.185 using deno as runtime environment and pm2 as process manager.

```sh
pm2 start cultmagazine-server-opine.ts --interpreter="deno" --interpreter-args="run --allow-read --allow-env --allow-net" -- 80

```

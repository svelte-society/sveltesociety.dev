# CULT Magazine

Welcome to our decentralized magazine. We are a volunteer global network of CULTDAO fans who promote freedom, fairness, education, transparency and love. Everyone is invited to contribute corresponding content via [pull request](https://www.youtube.com/watch?v=8lGpZkjnkt4). You can also feel free to raise [issues](https://github.com/michael-spengler/cultmagazine/issues) on this repository if you want to suggest improvement proposals etc.

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

## Deploying on central server (current approach)

I deployed this e.g. on server 116.203.185.185 using deno as runtime environment and pm2 as process manager.

```sh
pm2 start cultmagazine-server-opine.ts --interpreter="deno" --interpreter-args="run --allow-read --allow-env --allow-net" -- 443

```

## Deploying on IPFS (future approach)

Similar to how the deployment was done for the [cultkamasutra](https://cultkamasutra.eth.limo/).
Ensuring the assets, resources, ideas are easily accessible to prevent dictatorship and to ensure freedom and fairness.

## https ssh enablement

Using [eff's certbot](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) to get a certificate.

## Manual on How to Monetize Such Contributions

I submitted act of revolt [here](https://revolt.cultdao.io/submitProposal) with the following credentials:

I programmed https://cultmagazine.org

https://twitter.com/Peer2peerE

The idea of the cultmagazine.org is to have a decentralized magazine where everyone can contribute. All contributions can be submitted as acts of revolt. The cycle keyword shall be included in the commit message or in the corresponding pull request description on github.com.
I added "Article" in the latest commit messages on https://github.com/michael-spengler/cultmagazine.
After collecting ideas on https://github.com/michael-spengler/fairness/blob/main/README.md I decided it's time :) to provide further cultdao ecosystem features. Earlier I provided: https://cultkamasutra.eth.limo

https://cultmagazine.org, https://github.com/michael-spengler/cultmagazine

0x9E972a43B3B8D68cD70930697E16429E47E88151

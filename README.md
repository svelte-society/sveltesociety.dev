# CULT Magazine

Welcome to our decentralized [cultmagazine.org](https://cultmagazine.org). We are a volunteer network of CULTDAO fans flying around our sun on a beautiful planet named earth within a galaxy named Milky Way. We promote freedom, fairness, education, transparency and love. Everyone is invited to contribute corresponding content via [pull request](https://www.youtube.com/watch?v=8lGpZkjnkt4). You can also feel free to raise [issues](https://github.com/michael-spengler/cultmagazine/issues) on this repository if you want to suggest improvement proposals etc.

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

## Deploying on ipfs.io connecting via ens.domains (future approach)

Similar to how the deployment was done for the [cultkamasutra](https://cultkamasutra.eth.limo/).
Ensuring the assets, resources, ideas are easily accessible to prevent dictatorship and to ensure freedom and fairness.

## https ssh enablement

Using [eff's certbot](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) to get a certificate.

## Manual on How to Monetize Such Contributions

I submitted act of revolt 993 [here](https://revolt.cultdao.io/submitProposal).  
It was close and it got rejected. So I lowered the reward from 0.75 to 0.5 in act of revolt 1012. 

![Screenshot 2022-09-22 at 22 26 19](https://user-images.githubusercontent.com/43786652/191844555-b4b9e9b7-2ff1-473c-976d-e18022625ef9.png)

## Contributions

Contributions - e.g. via Pull Request - are welcome and can be submitted as acts of revolt.

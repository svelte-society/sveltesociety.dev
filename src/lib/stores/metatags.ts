import { Writable, writable } from 'svelte/store'

type Metatags = {
    title: string,
    description: string,
    type: string,
    image: string,
    'twitter:title': string,
    "twitter:description": string,
    "twitter:card": string,
    "twitter:image": string,
    "twitter:url": string,
    "og:title": string,
    "og:description": string,
    "og:type": string,
    "og:image": string,
    "og:url": string

}

const initialTags: Metatags = {
    title: '',
    description: '',
    type: 'website',
    image: '',
    "twitter:title": '',
    "twitter:description": '',
    "twitter:card": '',
    "twitter:image": '',
    "twitter:url": '',
    "og:title": '',
    "og:description": '',
    "og:type": 'website',
    "og:image": '',
    "og:url": ''
}

type MetaTagsStore = {
    subscribe: Writable<Metatags>["subscribe"],
    set: Writable<Metatags>["set"],
    title: (title: string) => void,
    desc: (desc: string) => void,
    image: (image: string) => void,
    url: (url: string) => void

}

function CreateMetatagsStore(): MetaTagsStore {
    const { subscribe, set, update } = writable(initialTags)

    const title = (title) => update(curr => ({...curr, title: title, "og:title": title, 'twitter:title': title}))
    const desc = (desc) => update(curr => ({...curr, description: desc, "og:description": desc, 'twitter:description': desc}))
    const image = (image) => update(curr => ({...curr, image: image, "og:image": image, 'twitter:image': image}))
    const url = (url) => update(curr => ({...curr, "og:url": url, 'twitter:url': url}))


    return {
        subscribe,
        set,
        url,
        title,
        desc,
        image
    }

}

const store: MetaTagsStore = CreateMetatagsStore()

export default store; 
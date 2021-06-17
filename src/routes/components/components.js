const components = new Array(6)
.fill({
  image: "/preview-image.png",
  title: "svelte-tooltip",
  description:
    "A tooltip action that you can attach to any element and pass in a Svelte component...",
  tags: [],
  stars: 511,
  addedOn: new Date(),
  category: "forms"
})
.concat(
  new Array(3).fill({
    image: "/preview-image.png",
    title: "svelte-ui",
    description:
      "A tooltip action that you can attach to any element and pass in a Svelte component...",
    tags: [],
    stars: 511,
    addedOn: new Date(),
    category: "ui"
  })
);
export default components;
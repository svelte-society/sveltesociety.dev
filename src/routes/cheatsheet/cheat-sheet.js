const replPath = 'https://svelte.dev/repl';
const docPath = 'https://svelte.dev/docs';

export const cheatSheet = [
	{
		title: 'Svelte Component',
		repl: `${replPath}/6a5416148c4b410b8ee0325eef54b107`,
		doc: `${docPath}#component-format`,
		content: `<!-- Widget.svelte -->
<script>
  export let textValue
</script>

<div class="container">
  {textValue}
</div>

<style>
.container {
  color: blue;
}
</style>

<!-- App.svelte -->
<script>
  import Widget from './Widget.svelte'
  const title = 'App'
</script>

<header>{title}</header>

<Widget textValue="I'm a svelte component" />
`
	},
	{
		title: 'Expressions',
		repl: `${replPath}/27bd55a7357046f2911923069dee9d86`,
		doc: `${docPath}#template-syntax-text-expressions`,
		content: `<script>
  let isShowing = true
  let cat = 'cat'
  let user = {name: 'John Wick'}
  let email = 'professionalkiller@gmail.com'
</script>

<p>2 + 2 = {2 + 2}</p>
   
<p on:click={() => isShowing = !isShowing}>
  {isShowing 
    ? 'NOW YOU SEE ME 👀' 
    : 'NOW YOU DON\`T SEE ME 🙈'}
</p>

<p>My e-mail is {email}</p>
<p>{user.name}</p>
<p>{cat + \`s\`}</p>
<p>{\`name \${user.name}\`}</p>`
	},
	{
		title: 'Simple Bind',
		repl: `${replPath}/505dfd64708844c7b28ead4834059d69`,
		doc: `${docPath}#template-syntax-attributes-and-props`,
		content: `//MyLink.svelte
<script>
    export let href = ''
    export let title = ''
    export let color = ''
</script>

<a href={href} style="color: {color}" >
  {title}
</a>

// Shorthand
<a {href} style="color: {color}" >
  {title}
</a>

<script>
  import MyLink from "./components/MyLink";
  let link = {
    href: "http://www.mysite.com",
    title: "My Site",
    color: "#ff3300"
  };
</script>

<MyLink {...link} />
`
	},
	{
		title: 'Two Way Bind',
		repl: `${replPath}/63c1cc2e6ab24d33ae531d6acdabc14e`,
		doc: `${docPath}#template-syntax-component-directives-bind-property`,
		content: `<MyInput bind:value={value} />

// Shorthand
<MyInput bind:value />

<select multiple bind:value={fillings}>
  <option value="Rice">Rice</option>
  <option value="Beans">Beans</option>
  <option value="Cheese">Cheese</option>
</select>

<input 
  type="radio" 
  bind:group={tortilla} 
  value="Plain" />
<input
  type="radio" 
  bind:group={tortilla} 
  value="Whole wheat" />

<input 
  type="checkbox" 
  bind:group={fillings} 
  value="Rice" />
<input 
  type="checkbox" 
  bind:group={fillings} 
  value="Beans" />

// Element Binding
<script>
  let myDiv
</script>

<button on:click={() => myDiv.innerText = 'My text'}>
  Click
</button>

<div bind:this={myDiv}/>
`
	},
	{
		title: 'Use action',
		repl: `${replPath}/6262d071414f42e98cdeed1f3c78d93e`,
		doc: `${docPath}#template-syntax-element-directives-use-action`,
		content: `<script>
  function myFunction(node) {
    // the node has been mounted in the DOM
    return {
      destroy() {
        // the node has been removed from the DOM
      }
    };
  }
</script>

<div use:myFunction></div>
    `
	},
	{
		title: 'Conditional Render',
		repl: `${replPath}/b023c56cdf0d42819fe7ccc38ea75c41`,
		doc: `${docPath}#template-syntax-if`,
		content: `{#if condition}
  <p>Condition is true</p>
{:else if otherCondition}
  <p>OtherCondition is true</p>
{:else}
  <p>Any Condition is true</p>
{/if}

// Re render
{#key value}
	<div transition:fade>{value}</div>
{/key}
`
	},
	{
		title: 'Await Template',
		repl: `${replPath}/22a36f1affba4334807a133d985ce6ef`,
		doc: `${docPath}#template-syntax-await`,
		content: `{#await promise}
  <p>waiting for the promise to resolve...</p>
{:then value}
  <p>The value is {value}</p>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
`
	},
	{
		title: 'Render HTML',
		repl: `${replPath}/44896bb6272d48b2a0a5909678b07cc9`,
		doc: `${docPath}#template-syntax-html`,
		content: `<script>
  const myHtml = '<span><strong>My text:</strong> text</span>'
</script>

{@html '<div>Content</div>'}

{@html myHtml}
`
	},
	{
		title: 'Handle Events',
		repl: `${replPath}/10cfb455b7b84514b35913aabee8b5c3`,
		doc: `${docPath}#template-syntax-element-directives-on-eventname`,
		content: `<button on:click={handleClick}>
  Press me
</button>

<button on:click={() => console.log('I was pressed')}>
  Press me
</button>

<button on:click|once={handleClick}>
  Press me
</button>

<button on:submit|preventDefault={handleClick}>
  Press me
</button>
`
	},
	{
		title: 'Forwarding Event',
		repl: `${replPath}/f1e3b92d7a3c466bb614aa8f49cde3b1`,
		doc: `${docPath}#run-time-svelte-createeventdispatcher`,
		content: `// Widget.svelte
<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('message', { text: 'Hello!' })} />
<button on:click>Press me</button>

// App.svelte
<script>
import Widget from '.Widget.svelte'
</script>

<Widget 
  on:click={() => alert('I was clicked')} 
  on:message={e => alert(e.detail.text)}>

`
	},
	{
		title: 'Rendering List',
		repl: `${replPath}/db8ac032184b455bbeed903ba042937c`,
		doc: `${docPath}#template-syntax-each`,
		content: `<ul>
  {#each items as item}
  <li>{item.name} x {item.qty}</li>
  {:else}
  <li>Empty list</li>
  {/each}
</ul>

//INDEX
{#each items as item, index}
  <li>
    {index + 1}: {item.name} x {item.qty}
  </li>
{/each}

//INDEX                       (KEY)
{#each items as item, index (item.id)}
  <li>
    {index + 1}: {item.name} x {item.qty}
  </li>
{/each}
`
	},
	{
		title: 'Using Slot',
		repl: `${replPath}/4844ee8feb794ed4bde10508cdb177cf`,
		doc: `${docPath}#template-syntax-slot`,
		content: `<!-- Widget.svelte -->
<div>
  <slot>Default content</slot>
</div>

<!-- App.svelte -->
<Widget />
<Widget>
  <p>I   changed the default content</p>
</Widget>
`
	},
	{
		title: 'Multiple Slot',
		repl: `${replPath}/abc6ecc5953c4c77af402185a2219df4`,
		doc: `${docPath}#template-syntax-slot-slot-name-name`,
		content: `<!-- Widget.svelte -->
<div>
  <slot name="header">
    No header was provided
  </slot>

  <slot>
    <p>Some content between header and footer</p>
  </slot>

  <slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
  <h1 slot="header">Hello</h1>
  <p slot="footer">
    Copyright (c) 2020 Svelte Brazil
  </p>
</Widget>

<!-- FancyList.svelte -->
<ul>
{#each items as item}
  <li class="fancy">
    <slot name="item" {item} />
  </li>
{/each}
</ul>

<!-- App.svelte -->
<FancyList {items}>
  <div slot="item" let:item>
    {item.text}
  </div>
</FancyList>
`
	},
	{
		title: 'Class Binding',
		repl: `${replPath}/c0c8e997fec1428ba670d4a95829d110`,
		doc: `${docPath}#template-syntax-element-directives-class-name`,
		content: `<script>
   export let type = 'normal'
   export let active = true
</script>

<div class={active ? 'active' : ''}  class={type}>
...
</div>

<div class:active={active} class={\`otherClass \${type}\`}>
...
</div>


// Match class

<div class:active>...</div>
`
	},
	{
		title: 'Lifecycle',
		repl: `${replPath}/ca959a7e552a4b35aa678dbe9a2d2b48`,
		doc: `${docPath}#run-time-svelte`,
		content: `
<script>
import { onMount } from 'svelte'

onMount(() => {
  console.log('Mounting')
  return () => console.log('going out')
})
</script>


// Other lifecycle functions
[
  onMount(() => {}),
  beforeUpdate(() => {}),
  afterUpdate(() => {}),
  onDestroy(() => {})
]`
	},
	{
		title: 'Animations',
		repl: `${replPath}/f2ba3adfe6cf49a58a38540530567354`,
		doc: `${docPath}#run-time-svelte-animate`,
		content: `<script>
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  let list = [1, 2, 3];
</script>

{#each list as n (n)}
  <div animate:flip={{ 
    delay: 250, 
    duration: 250, 
    easing: quintOut
  }}>
    {n}
  </div>
{/each}
`
	},
	{
		title: 'Transitions',
		repl: `${replPath}/6e505d732f1e48abbd7d3c4ba4cfc34c`,
		doc: `${docPath}#run-time-svelte-transition`,
		content: `<script>
  import { fade } from "svelte/transition";
  export let condition;
</script>

{#if condition}
  <div transition:fade={{ delay: 250, duration: 300 }}>
    fades in  and out
  </div>
{/if}

// Other transitions
[Blur, Scale, Fly, Draw, Slide]
`
	},
	{
		title: 'Reactive Expressions',
		repl: `${replPath}/0f7793bf7b0745f1b356327fad4a71e1`,
		doc: `${docPath}#component-format-script-2-assignments-are-reactive`,
		content: `<script>
  let num = 0
  $: squared = num * num
  $: cubed = squared * num
</script>

<button on:click={() => num = num + 1}>
  Increment: {num}
</button>

<p>{squared}</p>
<p>{cubed}</p>
`
	},
	{
		title: 'Reactive Statement',
		repl: `${replPath}/b959727e045e4eb7b70c7f16e425fed5`,
		doc: `${docPath}#component-format-script-3-$-marks-a-statement-as-reactive`,
		content: `<script>
  $: if (count >= 10) {
    alert('count is dangerously high!')
    count = 9
  }

  let foo, bar, baz

  $: quux = foo + bar
  $: console.log(quux)

  $: {
    // block expression
  }

  $: if (quux > 10) {
    // actually any ->
  } else {
    // js expression
  }

  $: for (let i = 0; i < baz; i++) {
    // any js expression
  }

  // function declaration too
  $: grunt = arg => quux / arg * baz

  $: { // this would also work
    if (quux < 10) break $
    baz++
  }

  $: (async () => { // and even this
    bar = await Promise.resolve(foo%2)
  })()
</script>
`
	},
	{
		title: 'Dynamically select a component',
		repl: `${replPath}/e5d239c2a3574d0aa0f4d33b46ea58fd`,
		doc: `${docPath}#template-syntax-svelte-component`,
		content: `<!-- Title1.svelte -->
<h1>    Component 1  </h1>

<!-- Title2.svelte -->
<h2>    Component 2  </h2>

<!-- App.svelte -->
<script>
  import Title1 from './Title1.svelte'
  import Title2 from './Title2.svelte'

  let component = Title1
  let name = 'world';
</script>

<select bind:value={component}>
  <option value={Title1}>Title 1</option>
  <option value={Title2}>Title 2</option>
</select>

<svelte:component this={component} />`
	},
	{
		title: 'Changing style properties',
		repl: `${replPath}/cb8adc064eb246de9030b3b1cbc357cb?`,
		doc: `${docPath}#template-syntax-element-directives-style-property`,
		content: `<!-- These are equivalent -->
<div style:color="red">...</div>
<div style="color: red;">...</div>

<!-- Variables can be used -->
<div style:color={myColor}>...</div>
<div style="color: {myColor}">...</div>

<!-- Shorthand, for when property and variable name match -->
<div style:color>...</div>

<!-- Multiple styles can be included -->
<div style:color style:width="12rem" style:background-color={darkMode ? "black" : "white"}>...</div>`
	}
];

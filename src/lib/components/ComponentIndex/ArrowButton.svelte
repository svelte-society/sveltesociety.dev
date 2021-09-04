<script>
  export const primary = false;
  export let active = false;
  export let small = false
</script>

<style>
  div {
    font-size: 1rem;
    border: 2px solid var(--dark-gray);
    border-radius: 5px;
    background-color: white;
    color: var(--dark-gray);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px;
    position: relative;
  }
  div.small {
    font-size: var(--font-100);
    padding: 3px 10px;
  }
  div:hover {
    cursor: pointer;
    border-color: var(--primary);
    color: var(--primary);
  }

  .arrow {
    margin-left: 25px;
    height: 16px;
    -webkit-mask: url(/images/right-arrow.svg) no-repeat center;
    mask: url(/images/right-arrow.svg) no-repeat center;
    background-color: var(--dark-gray);
  }
  div:hover .arrow {
    background-color: var(--dark-gray);
  }
  .arrow.active {
    background-color: var(--dark-gray);
  }

  .popin {
    min-width: 250px;
    width: 100%;
    font-size: var(--font-100);
    display: none;
    position: absolute;
      left: var(--s-4);
      top: 100%;
    z-index: 100;
    margin: 0;
    padding: 0;
    border: 2px solid var(--primary);
    border-radius: 5px;
    background: white;
  }
  div:hover .popin:not(:empty) {
    display: block;
  }
  

  @media screen and (min-width: 700px) {
    .popin {
      left: 95%;
      top: var(--s-4);
    }
  }
</style>

<div on:click class:small>
  <span>
    <slot />
  </span>
  <div class="arrow" class:active />
  <section class="popin"><slot name="menu"></slot></section>
</div>

<script>
  export const primary = false;
  export let active = false;
  export let small = false
</script>

<style>
  div {
    border: 2px solid #7e7e93;
    border-radius: 5px;
    background-color: white;
    color: #7e7e93;
    display: flex;
    align-items: center;
    padding: 5px 15px;
    position: relative;
  }
  div.small {
    font-size: 0.8em;
    padding: 3px 10px;
  }
  div:hover {
    cursor: pointer;
    border-color: var(--color) !important;
    color: var(--color) !important;
  }

  .arrow {
    margin-left: 25px;
    height: 16px;
    -webkit-mask: url(/images/right-arrow.svg) no-repeat center;
    mask: url(/images/right-arrow.svg) no-repeat center;
    background-color: #7e7e93;
  }
  div:hover .arrow {
    background-color: var(--color);
  }
  .arrow.active {
    background-color: var(--color-secondary);
  }

  .popin {
    display: none;
    position: absolute;
    left: calc(100% - 1em);
    top: 1em;
    z-index: 100;
    margin: 0;
    padding: 0;
    border: 2px solid var(--color);
    border-radius: 5px;
    background: white;
  }
  div:hover .popin:not(:empty) {
    display: block;
  }

  @media screen and (max-width: 700px) {
    .popin {
      left: 1rem;
      right: 1rem;
      top: 100%
    }
  }
</style>

<div on:click class:small>
  <span>
    <slot />
  </span>
  <div class="arrow" class:active />
  <span class="popin"><slot name="menu"></slot></span>
</div>

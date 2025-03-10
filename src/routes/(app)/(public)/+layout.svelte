<script lang="ts">
const { data, children } = $props()

import LeftSidebar from './_components/LeftSidebar.svelte'
import RightSidebar from './_components/RightSidebar.svelte'
import { convertTags } from '$lib/types/content'
import { toggleLeftSidebar, toggleRightSidebar } from '$lib/stores/ui'

// Convert tags to the expected format with string IDs
const formattedTags = data.tags ? convertTags(data.tags) : []
</script>

<div class="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto relative">
  <!-- Left sidebar - hidden on mobile/tablet, shown on desktop -->
  <button aria-label="Close left sidebar" class="fixed inset-0 z-30 bg-white opacity-90 transition-opacity lg:hidden" 
       class:hidden={!$toggleLeftSidebar} 
       onclick={() => toggleLeftSidebar.set(false)}>
  </button>
  
  <div class="fixed top-0 left-0 bottom-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:static lg:transform-none lg:transition-none"
       class:translate-x-0={$toggleLeftSidebar}
       class:-translate-x-full={!$toggleLeftSidebar}
       class:lg:translate-x-0={true}>
    <LeftSidebar />
  </div>

  <!-- Main content area - full width on mobile/tablet, flex on desktop -->
  <main class="flex-1 px-4 py-6 lg:py-8 w-full">
    <div class="lg:hidden flex justify-between mb-4">
      <button aria-label="Toggle left sidebar" class="p-2 rounded-md hover:bg-gray-100" onclick={() => toggleLeftSidebar.set(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <button aria-label="Toggle right sidebar" class="p-2 rounded-md hover:bg-gray-100" onclick={() => toggleRightSidebar.set(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
    
    {@render children()}
  </main>

  <!-- Right sidebar - hidden on mobile/tablet, shown on desktop -->
  <button aria-label="Close right sidebar" class="fixed inset-0 z-30 bg-white opacity-90 transition-opacity lg:hidden" 
       class:hidden={!$toggleRightSidebar} 
       onclick={() => toggleRightSidebar.set(false)}>
  </button>
  
  <div class="fixed top-0 right-0 bottom-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:static lg:transform-none lg:transition-none"
       class:translate-x-0={$toggleRightSidebar}
       class:translate-x-full={!$toggleRightSidebar}
       class:lg:translate-x-0={true}>
    <RightSidebar tags={formattedTags} />
  </div>
</div>

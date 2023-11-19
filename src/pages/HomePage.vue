<template>
  <div class="bg-gradient-to-r from-gray-600 to-stone-800 text-white p-8">
    <h1 class="text-4xl font-bold mb-2">Wallpaper Changer</h1>
    <p class="text-sm text-right">By <span class="text-md">Vivek Muthal</span></p>
  </div>
  <div class="container mx-auto p-4">
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
      v-if="isSettingWallpaper"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
        <div class="text-center">
          <div class="mb-4 text-2xl font-bold text-gray-700">Setting Wallpaper</div>
          <div
            class="h-12 w-12 animate-spin mx-auto my-4 rounded-full border-t-4 border-solid border-blue-500"
          ></div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="w-1/4 p-4">
        <div class="relative mb-3">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search keywords"
            v-model="searchQuery"
            v-on:keypress.enter="searchImages"
          />
        </div>
        <div class="flex flex-wrap">
          <span
            class="text-white rounded-full px-3 py-1 m-1 cursor-pointer"
            v-bind:class="{
              'bg-blue-500': tag != reqData.query,
              'bg-green-500': tag == reqData.query
            }"
            v-for="tag in wallpaperKeywords"
            v-on:click="setTag(tag)"
            >{{ tag }}</span
          >
        </div>
      </div>

      <div class="w-3/4 p-4">
        <div class="flex items-center justify-center h-screen" v-if="isLoading">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
          ></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div
            class="rounded-lg p-4 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
            v-for="image in images"
            v-on:click="setWallpaper(image.src.large2x)"
          >
            <img
              :src="image.src.tiny"
              alt="Wallpaper 1"
              class="w-full h-32 object-cover rounded-lg mb-4"
            />
            <p class="text-black font-semibold">{{ image.alt }}</p>
          </div>
        </div>
        <div class="flex items-center justify-center space-x-4">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            v-on:click="prevPage()"
            :disabled="reqData.page == 1"
            v-bind:class="{ 'opacity-50': reqData.page == 1 }"
          >
            Prev
          </button>
          <span class="text-lg font-bold">Page {{ reqData.page }}</span>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            v-on:click="nextPage()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'

const wallpaperKeywords = ref([
  'Nature',
  'Galaxy',
  'Sunset',
  'Abstract',
  'Cityscape',
  'Mountains',
  'Ocean',
  'Animals',
  'Flowers',
  'Space',
  'Landscapes',
  'Minimalist',
  'Vintage',
  'Rain',
  'Architecture',
  'Waterfalls',
  'Forest',
  'Beach',
  'Technology',
  'Underwater',
  'Aurora',
  'Desert',
  'Skyscrapers',
  'Wildlife',
  'Sunrise',
  'Stars',
  'Clouds',
  'Colorful',
  'Urban',
  'Tropical',
  'Countryside',
  'Patterns',
  'Digital Art',
  'Fantasy',
  'Travel',
  'Macro',
  'Fireworks',
  'Futuristic',
  'Graffiti',
  'Reflections',
  'Islands',
  'Celestial',
  'Holographic',
  'Neon',
  'Cosmic',
  'Dreamy',
  'Surreal',
  'Pixel Art',
  'Retro',
  'Enchanted',
  'Outer Space',
  'Elegant',
  'Mystical',
  'Nightlife',
  'Rainbows',
  'Botanical',
  'Jungle',
  'Metropolitan',
  'Dreamscape',
  'Tranquil',
  'Whimsical',
  'Modern',
  'Sculpture',
  'Ethereal',
  'Vibrant',
  'Steampunk',
  'Time-lapse',
  'Dystopian',
  'Watercolor',
  'Inspirational',
  'Vast',
  'Cyberpunk',
  'Serenity',
  'Contemporary',
  'Glitch',
  'Mystic',
  'Cinematic',
  'Grayscale',
  'Epic',
  'Serene',
  'Dynamic',
  'Calm',
  'Antique',
  'Sunny',
  'Universe',
  'Silhouette',
  'High-Tech',
  'Medieval',
  'Sunlit',
  'Geometric',
  'Mosaic',
  'Gothic',
  'Rural',
  'Enigmatic',
  'Industrial',
  'Monochrome',
  'Starlit',
  'Frozen',
  'Pastel',
  'Foliage',
  'Urbex',
  'Desolate',
  'Chromatic',
  'Golden Hour',
  'Cascades',
  'Aquatic',
  'Steampunk',
  'Zen',
  'Time Travel',
  'Majestic',
  'Shadows',
  'Vintage',
  'Mythical',
  'Energetic',
  'Aquarium',
  'Floral',
  'Alternate Reality',
  'Lively',
  'Glowing',
  'Dramatic',
  'City Lights',
  'Secret Garden',
  'Nocturnal',
  'Crystal',
  'Seascape',
  'Luminous',
  'Retro-futuristic',
  'Pixelated',
  'Urban Jungle',
  'Aerial',
  'Cyberspace',
  'Enchanted',
  'Galactic',
  'Artistic',
  'Floating',
  'Organic',
  'Wilderness',
  'Panoramic',
  'Harmony',
  'Dystopian',
  'Dimensional',
  'Magical',
  'Transcendent',
  'Renewed',
  'Rhythmic',
  'Serendipity',
  'Crystal Clear',
  'Intricate',
  'Pastoral',
  'Nocturne',
  'Symmetry',
  'Radiant',
  'Sunburst',
  'Journey',
  'Nebula',
  'Enveloping',
  'Daydream',
  'Astral',
  'Ephemeral',
  'Monumental',
  'Gentle',
  'Reflection',
  'Landscape',
  'Epic',
  'Mind-bending',
  'Lush',
  'Starry Night',
  'Illusion',
  'Sun-kissed'
])

const isLoading = ref(true)

const images = ref([])

const reqData = reactive({
  query: wallpaperKeywords.value[0],
  perPage: 50,
  page: 1
})

const getImages = async function () {
  isLoading.value = true
  const response = await fetch('/api/images', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqData)
  })

  const json = await response.json()

  isLoading.value = false

  return json.photos
}
const isSettingWallpaper = ref(false)

const setWallpaper = async function (url) {
  isSettingWallpaper.value = true
  const response = await fetch('/api/setwallpaper', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url })
  })
  const json = await response.json()
  setTimeout(() => {
    isSettingWallpaper.value = false
  }, 1000)

  return json
}

onMounted(async () => {
  images.value = await getImages(reqData)
})

const setTag = async function (tag) {
  reqData.page = 1
  reqData.query = tag

  images.value = await getImages(reqData)
}

const nextPage = async function () {
  reqData.page++
  images.value = await getImages(reqData)
}

const prevPage = async function () {
  reqData.page--
  images.value = await getImages(reqData)
}

const searchQuery = ref('')

const searchImages = async function () {
  reqData.query = searchQuery
  images.value = await getImages(reqData)
}
</script>

<template>
  <div class="loader mx-auto"></div>
</template>

<style scoped>
.loader {
  width: 20px;
  height: 19px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #000000 94%, #0000) top/5px 5px no-repeat,
    conic-gradient(#0000 30%, #000000);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 5px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>

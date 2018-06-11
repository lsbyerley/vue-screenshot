<template>
  <div class="🤚">
  	<div class="👉"></div>
  	<div class="👉"></div>
  	<div class="👉"></div>
  	<div class="👉"></div>
  	<div class="🌴"></div>
  	<div class="👍"></div>
  </div>
</template>

<style lang="scss">
.🤚 {
  --skin-color: #e4c560;
  --tap-speed: 0.6s;
  --tap-stagger: 0.1s;

  position: relative;
  width: 8vw;
  height: 6vw;
  margin-left: 4rem;
  margin-bottom: 4rem;
  margin-top: 4rem;

  &:before {
    content: "";
    display: block;
    width: 180%;
    height: 75%;
    position: absolute;
    top: 70%;
    right: 20%;
    background-color: black;
    border-radius: 4vw 1vw;
    filter: blur(10px);
    opacity: 0.3;
  }
}

.🌴 {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--skin-color);
  border-radius: 1vw 4vw;
}

.👍 {
  position: absolute;
  width: 120%;
  height: 3.2vw;
  background-color: var(--skin-color);
  bottom: -18%;
  right: 1%;
  transform-origin: calc(100% - 2vw) 2vw;
  transform: rotate(-20deg);
  border-radius: 3vw 2vw 2vw 1vw;
  border-bottom: 2px solid rgba(black, 0.1);
  border-left: 2px solid rgba(black, 0.1);

  &:after {
    width: 20%;
    height: 60%;
    content: "";
    background-color: rgba(white, 0.3);
    position: absolute;
    bottom: -8%;
    left: 0.5vw;
    border-radius: 60% 10% 10% 30%;
    border-right: 2px solid rgba(black, 0.05);
  }
}

.👉 {
  position: absolute;
  width: 80%;
  height: 3.5vw;
  background-color: var(--skin-color);
  bottom: 32%;
  right: 64%;
  transform-origin: 100% 2vw;

  animation-duration: calc(var(--tap-speed) * 2);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform: rotate(10deg);

  &:before {
    content: "";
    position: absolute;
    width: 140%;
    height: 3.5vw;
    background-color: var(--skin-color);
    bottom: -3%;
    right: 65%;
    transform-origin: calc(100% - 2vw) 2vw;
    transform: rotate(-60deg);
    border-radius: 2vw;
  }

  &:nth-child(1) {
    animation-delay: 0;
    filter: brightness(70%);
    animation-name: tap-upper-1;
  }

  &:nth-child(2) {
    animation-delay: var(--tap-stagger);
    filter: brightness(80%);
    animation-name: tap-upper-2;
  }

  &:nth-child(3) {
    animation-delay: calc(var(--tap-stagger) * 2);
    filter: brightness(90%);
    animation-name: tap-upper-3;
  }

  &:nth-child(4) {
    animation-delay: calc(var(--tap-stagger) * 3);
    filter: brightness(100%);
    animation-name: tap-upper-4;
  }
}

@keyframes tap-upper-1 {
  0%,
  50%,
  100% {
    transform: rotate(10deg) scale(0.4);
  }
  40% {
    transform: rotate(50deg) scale(0.4);
  }
}

@keyframes tap-upper-2 {
  0%,
  50%,
  100% {
    transform: rotate(10deg) scale(0.6);
  }
  40% {
    transform: rotate(50deg) scale(0.6);
  }
}

@keyframes tap-upper-3 {
  0%,
  50%,
  100% {
    transform: rotate(10deg) scale(0.8);
  }
  40% {
    transform: rotate(50deg) scale(0.8);
  }
}

@keyframes tap-upper-4 {
  0%,
  50%,
  100% {
    transform: rotate(10deg) scale(1);
  }
  40% {
    transform: rotate(50deg) scale(1);
  }
}
</style>

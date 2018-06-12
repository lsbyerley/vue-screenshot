<template>
  <nav class="navbar is-white">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item brand-text" href="../">Vue Screenshot</a>
        <div class="navbar-burger burger" data-target="navMenu">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div id="navMenu" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" href="https://twitter.com/lsbyerley" target="_blank">by @lsbyerley</a>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <p class="control">
            <a class="button is-primary" target="_blank" href="https://twitter.com/share?url=https://vuescreenshot.com&text=Fill out a url, get a screenshot">
              <b-icon
                pack="fa"
                icon="twitter"
                size="is-small">
              </b-icon>
              <span>Share</span>
            </a>
          </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav.navbar {
  border-top: 4px solid #276cda;
  margin-bottom: 1rem;
}
.navbar-item.brand-text {
  font-weight: 300;
}
.navbar-item,
.navbar-link {
  font-size: 14px;
  font-weight: 700;
}
</style>

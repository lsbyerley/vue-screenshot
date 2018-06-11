<template>

  <div class="container">

    <section class="hero is-info welcome is-small">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Hello, screenshotter!</h1>
          <h2 class="subtitle">Fill out the url, get a pic of the site</h2>
        </div>
      </div>
    </section>

    <div class="columns">
      <div class="column is-4">

        <button class="button is-link is-medium is-fullwidth getshot" v-bind:class="getScreenshotButtonClass()" v-on:click="onUrlSubmit" :disabled="!isUrlValid">Get Screenshot</button>

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">URL to Screenshot</p>
          </header>
          <div class="card-content">
            <div class="content">
              <b-field :addons="true">
                <b-select v-model="urlProtocol" size="is-medium">
                  <option value="https">https</option>
                  <option value="http">http</option>
                </b-select>
                <b-input v-model="inputUrl" @input="validateUrl" size="is-medium" expanded type="text" placeholder="Enter website url"></b-input>
              </b-field>
            </div>
          </div>
        </div>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Viewport Size (px)</p>
          </header>
          <div class="card-content">
            <div class="content">
              <b-field>
                <b-select v-model="viewportSize" size="is-medium">
                  <option value="320x569">Small - 320x569</option>
                  <option value="360x640">Small - 360x640</option>
                  <option value="480x854">Small - 480x854</option>
                  <option value="960x540">Medium - 960x540</option>
                  <option value="1024x640">Large - 1024x640</option>
                  <option value="1366x768">Large - 1366x768</option>
                  <option value="1920x1080">Large - 1920x1080</option>
                </b-select>
              </b-field>
            </div>
          </div>
        </div>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Full Page? (height will be ignored)</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <b-checkbox
                  size="is-medium"
                  type="is-info"
                  v-model="fullpageCheckbox"
                  true-value="Yes"
                  false-value="No">
                  {{ fullpageCheckbox }}
                </b-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-8">

        <transition name="tapping-animation" enter-active-class="animated fadeInUp" leave-active-class="animated lightSpeedOut">
          <div class="card display" v-if="showTapping">
            <div class="card-content">
              <div class="content">
                <TappyLoader />
              </div>
            </div>
          </div>
        </transition>

        <transition name="error-animation" enter-active-class="animated fadeInUp" leave-active-class="animated lightSpeedOut">
          <div class="card display" v-if="showError">
            <header class="card-header error">
              <div class="notification is-danger" v-show="errorFetching">
                Either the request timed out or the url is incorrect. Please try again
              </div>
            </header>
            <div class="card-content">
              <div class="content">
                <img id="screenshot-img-error" src="@/assets/confused-emoji.png">
              </div>
            </div>
          </div>
        </transition>

        <transition appear name="placeholder-animation" enter-active-class="animated fadeIn" leave-active-class="animated lightSpeedOut">
          <div class="card display" v-if="showPlaceholder">
            <div class="card-content">
              <div class="content">
                <img id="screenshot-img-placeholder" src="@/assets/screenshot-placeholder.png">
              </div>
            </div>
          </div>
        </transition>

        <transition name="screenshot-animation" enter-active-class="animated fadeInUp" leave-active-class="animated lightSpeedOut">
          <div class="card display" v-if="showScreenshot">
            <header class="card-header dllink">
              <button class="button is-link is-medium is-fullwidth" v-bind:class="downloadButtonClass()" v-on:click="downloadScrenshot" :disabled="!allowDownload">Download Screenshot</button>
            </header>
            <div class="card-content">
              <div class="content">
                <img id="screenshot-img" :src="buildScreenshotSrc()">
              </div>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import { urlValidation } from '@/utils/util';
import FileSaver from 'file-saver';
import TappyLoader from '@/components/TappyLoader';

export default {
  name: "Dashboard",
  components: { TappyLoader },
  data() {
    return {
      isUrlValid: false,
      fullpageCheckbox: "No",
      urlProtocol: "https",
      inputUrl: "",
      viewportSize: "1366x768"
    };
  },
  computed: {
    ...mapState(["screenshot", "isFetching", "errorFetching"]),
    screenshotUrl() {
      return this.urlProtocol === "https" ? `https://${this.inputUrl}` : `http://${this.inputUrl}`;
    },
    allowDownload() {
      return this.screenshot.data.length > 0 && this.screenshot.type && !this.errorFetching && !this.isFetching
    },
    showTapping() {
      return this.isFetching && !this.errorFetching
    },
    showError() {
      return this.errorFetching && !this.isFetching
    },
    showScreenshot() {
      return this.screenshot.data.length > 0 && !this.isFetching && !this.errorFetching
    },
    showPlaceholder() {
      return this.screenshot.data.length === 0 && !this.isFetching && !this.errorFetching
    }
  },
  methods: {
    validateUrl() {
      this.isUrlValid = urlValidation(this.screenshotUrl)
    },
    async onUrlSubmit() {
      const fullPage = (this.fullpageCheckbox === "Yes") ? true : false;
      await this.$store.dispatch("getScreenshot", { url: this.screenshotUrl, viewportSize: this.viewportSize, fullPage: fullPage });
    },
    buildScreenshotSrc() {
      if (this.screenshot.data.length > 0) {
        const uintArray = new Uint8Array(this.screenshot.data);
        const blob = new Blob([uintArray], { type: this.screenshot.type });
        const src = URL.createObjectURL(blob)
        return src
      } else {
        return ''
      }
    },
    downloadScrenshot() {
      const uintArray = new Uint8Array(this.screenshot.data);
      const blob = new Blob([uintArray], { type: this.screenshot.type });
      FileSaver.saveAs(blob, "screenshot.png");
    },
    downloadButtonClass() {
      return {
        'button-pulse': (this.screenshot.data.length > 0 && !this.isFetching && !this.errorFetching),
      }
    },
    getScreenshotButtonClass() {
      return {
        'button-pulse': (urlValidation(this.screenshotUrl) && !this.isFetching && !this.errorFetching),
        'is-loading': this.isFetching === true
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hero.welcome.is-info {
  background: linear-gradient(to right, #5b86e5, #36d1dc);
  margin-bottom: 2rem;
}

.button-pulse {
  animation: radial-pulse 1s infinite;
}

.getshot {
  margin-bottom: 2rem;
}

.card.display {

  .notification {
    width: 100%;
  }

  .card-content .content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-header.dllink, .card-header.error {
    padding: 1rem;
  }

}

@keyframes radial-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.5);
  }

  100% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
}

.screenshot-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
}

.animated.lightSpeedOut {
  animation-duration: 0.5s;
}
</style>

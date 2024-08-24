// https://vitepress.dev/guide/custom-theme
import mediumZoom from "medium-zoom";
import type { Theme } from "vitepress";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, nextTick, onMounted, watch } from "vue";

// styles
import "./medium-zoom.css";
import "./style.css";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    const route = useRoute();

    // medium-zoom
    function initZoom() {
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    }

    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
} satisfies Theme;

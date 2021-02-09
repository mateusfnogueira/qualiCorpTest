<template>
  <v-app id="app">
    <v-app-bar
      class="d-flex align-center"
      color="#FFFFFF"
      max-height="80px"
      id="nav"
    >
      <v-img src="./assets/qualicorp-icon-1.png"></v-img>
    </v-app-bar>
    <v-main class="content-page pt-15">
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .content-page {
    background-color: #035685;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@media (min-width: 200px) and (max-width: 850px) {
  #app {
    width: 118%;
    .content-page {
      height: 150%;
    }
  }
}
</style>

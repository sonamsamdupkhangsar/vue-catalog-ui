<template>
  <div id="about">
    <p>{{ pageMessage }}</p>   
  </div>
</template>

<script>
export default {
  name: 'About',
  data: function () {
    return {
      authenticated: false,
      pageMessage: "You need to login"
    }
  },
}
</script>
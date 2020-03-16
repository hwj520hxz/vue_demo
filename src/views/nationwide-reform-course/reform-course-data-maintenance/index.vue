<template>
  <div class="content">
    <reformTheme
      @queryReformDetail="row => $refs['reformDetail'].featchData(row)"
      @refreshDetail="$refs['reformDetail'].clearGrid()"
    ></reformTheme>
    <reformDetail
      ref="reformDetail"
    ></reformDetail>
  </div>
</template>

<script>
import reformTheme from './reformTheme-maintenance'
import reformDetail from './reformDetail-maintenance'
export default {
  name: '',
  components: {
    reformTheme,
    reformDetail
  }
}
</script>

<style scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

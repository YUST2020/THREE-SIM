<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div>
  </div>
</template>

<script>
import Four from '../packages/Four'
import Obj from '../packages/Obj'
import ModelObj from '../packages/ModelObj'
import * as THREE from 'three'

class SharpObj extends Obj {
  constructor() {
    super(...arguments);
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    this.geometry = geometry;
    super.initBoundingBox();
  }
  drag() {
    // e.object.position.x = 0
  }
}

export default {
  name: 'App',
  data() {
    return {
      four: {}
    }
  },
  mounted() {
    this.four = new Four(this.$refs.container)
    // 放物体进来
    let pos = [
      [10, 0, 0],
      [0, 0, 10],
      [10, 0, 5],
      [10, 10, 0],
      [0, 5, 5],
    ];
    for (let p of pos) {
      let obj = 
      Math.random() > 0.5 ?
        new SharpObj({ x: p[0], y: p[1], z: p[2] }) :
        new Obj({ x: p[0], y: p[1], z: p[2] });
      this.four.add(obj)
    }
    const model = new ModelObj({x: 0,y:0,z:0})
    console.log(model);
    this.four.add(model)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

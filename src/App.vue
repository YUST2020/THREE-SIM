<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div>
    <div style="background-color: #fff;position: absolute;right: 100px;top: 100px">
      长<input><br>
      宽<input><br>
      高<input><br>
      x旋转<input><br>
      y旋转<input><br>
      z旋转<input><br>
    </div>
  </div>
</template>

<script>
import Four from '../packages/Four'
import Obj from '../packages/Obj'
import ModelObj from '../packages/ModelObj'
import * as THREE from 'three'

class CustomObj1 extends Obj {
  constructor() {
    super(...arguments);
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshMatcapMaterial({ color: 0xff0000 })
    this.add(new THREE.Mesh(geometry,material))
    super.initBoundingBox();
  }
}
class CustomObj2 extends Obj {
  constructor() {
    super(...arguments);
    let geometry = new THREE.BoxGeometry(1);
    let material = new THREE.MeshMatcapMaterial({ color: 0xff0000 })
    this.add(new THREE.Mesh(geometry,material))
    super.initBoundingBox();
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
        new CustomObj1({ x: p[0], y: p[1], z: p[2] }) :
        new CustomObj2({ x: p[0], y: p[1], z: p[2] });
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
  position: relative;
}
body,html {
  margin: 0;
  padding: 0;
}
</style>

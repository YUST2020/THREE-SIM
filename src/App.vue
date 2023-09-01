<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div> 
  </div>
</template>

<script>
// import { Four,Obj,ModelObj } from '../dist/laser-scene.umd.min.js'
// import '../dist/laser-scene.css'
import Four from '../packages/Four'
import Obj from '../packages/Obj'
import ModelObj from '../packages/ModelObj'
import * as THREE from 'three'
import VueLabel from './VueLabel.vue'
import Vue from 'vue'
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
      four: {},
      curObj: null,
      originSize: {}
    }
  },
  mounted() {
    console.log(Four);
    this.four = new Four(this.$refs.container)
    // 放物体进来
    let pos = [
      [10, 0, 0],
      [0, 0, 10],
      [10, 0, 5],
      [10, 10, 0],
      [0, 5, 5],
    ];
    let id = 1
    for (let p of pos) {
      let obj = 
      Math.random() > 0.5 ?
        new CustomObj1({ x: p[0], y: p[1], z: p[2] }, {id: id++}) :
        new CustomObj2({ x: p[0], y: p[1], z: p[2] }, {id: id++});
      this.four.add(obj)
    }
    const model = new ModelObj({x: 0,y:0,z:0})
    console.log(model);
    this.four.add(model)
    model.moveTo({x: 20,y:20,z: 20})
    
    this.four.addEvent('selectChange', (obj) => {
      if (!obj) return
      const dom = document.createElement('div')
      const vueComp = Vue.extend(VueLabel);
      new vueComp().$mount(dom)
      this.four.add2DLabel(obj,dom)
    })
  },
  methods: {
    
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

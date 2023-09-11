<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div>
    <button style="position: absolute;bottom: 30px;right: 30px;" @click="save">保存</button>
  </div>
</template>

<script>
// import { Four,Obj,ModelObj } from '../dist/laser-scene.umd.min.js'
// import '../dist/laser-scene.css'
import Four from '../packages/Four'
// import Obj from '../packages/Obj'
import ModelObj from '../packages/ModelObj'
// import * as THREE from 'three'
import VueLabel from './VueLabel.vue'
import Vue from 'vue'
import pos from './positionData'
// class CustomObj1 extends Obj {
//   constructor() {
//     super(...arguments);
//     let geometry = new THREE.SphereGeometry(1, 32, 32);
//     let material = new THREE.MeshMatcapMaterial({ color: 0xff0000 })
//     this.add(new THREE.Mesh(geometry,material))
//     super.initBoundingBox();
//   }
// }
// class CustomObj2 extends Obj {
//   constructor() {
//     super(...arguments);
//     let geometry = new THREE.BoxGeometry(1);
//     let material = new THREE.MeshMatcapMaterial({ color: 0xff0000 })
//     this.add(new THREE.Mesh(geometry,material))
//     super.initBoundingBox();
//   }
// }

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
    console.log(pos);
    this.four = new Four(this.$refs.container)
    for (let i of pos) {
      const obj = new ModelObj(i, null, i.path)
      this.four.add(obj)
      const element = document.createElement('div');
      element.style.backgroundColor = 'gray';
      element.innerText = i.path;
      this.four.add2DLabel(obj,element)
    }
    // // #region 车
    // const endCar = new ModelObj({ x: 10, y: 0, z: 0 }, null, 'model/endCar.obj')
    // this.four.add(endCar)
    // const machineBed = new ModelObj({ x: 0, y: 0, z: 0 }, null, 'model/machineBed.obj')
    // this.four.add(machineBed)
    // const outCar = new ModelObj({ x: 20, y: 0, z: 0 }, null, 'model/outCar.obj')
    // this.four.add(outCar)
    // // #endregion
    // // #region 料库相关
    // const wareHousePallet = new ModelObj({ x: 30, y: 0, z: 0 }, null, 'model/wareHouse/pallet.obj')
    // this.four.add(wareHousePallet)
    // const shelf = new ModelObj({x: 40,y:0,z:0}, null, 'model/wareHouse/shelf.obj')
    // this.four.add(shelf)
    // const updown = new ModelObj({ x: 50, y: 0, z: 0 }, null, 'model/wareHouse/updown.obj')
    // this.four.add(updown)
    // // #endregion
    // // #region 上料
    // const upfix = new ModelObj({ x: 0, y: 10, z: 0 }, null, 'model/up/fix.obj')
    // this.four.add(upfix)
    // const upZ = new ModelObj({ x: 0, y: 20, z: 0 }, null, 'model/up/upZ.obj')
    // this.four.add(upZ)
    // // #endregion
    // // #region 下料
    // const left = new ModelObj({ x: 0, y: 0, z: 10 }, null, 'model/down/left.obj')
    // this.four.add(left)
    // const right = new ModelObj({ x: 0, y: 0, z: 20 }, null, 'model/down/right.obj')
    // this.four.add(right)
    // const downZ = new ModelObj({ x: 0, y: 0, z: 30 }, null, 'model/down/downZ.obj')
    // this.four.add(downZ)
    // const downFixed = new ModelObj({ x: 0, y: 0, z: 40 }, null, 'model/down/fixed.obj')
    // this.four.add(downFixed)
    // // #endregion
    // model.moveTo({x: 20,y:20,z: 20})

    this.four.addEvent('selectChange', (obj) => {
      if (!obj) return
      const dom = document.createElement('div')
      const vueComp = Vue.extend(VueLabel);
      new vueComp().$mount(dom)
      this.four.add2DLabel(obj, dom)
    })
  },
  methods: {
    save() {
      console.log(this.four.objs);
      const data = this.four.objs.map(val => {
        const { x, y, z } = val.position
        const { x: scaleX, y: scaleY, z: scaleZ } = val.scale
        const { x: rotateX, y: rotateY, z: rotateZ } = val.rotation
        return {
          x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, path: val.options.path
        }
      })
      console.log(data);
      console.log(JSON.stringify(data));
    }
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

body,
html {
  margin: 0;
  padding: 0;
}
</style>

<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div>
    <button style="position: absolute;bottom: 30px;right: 80px;" @click="loadPlane">上料</button>
    <button style="position: absolute;bottom: 30px;right: 30px;" @click="save">保存</button>
  </div>
</template>

<script>
// import { Four,Obj,ModelObj } from '../dist/laser-scene.umd.min.js'
// import '../dist/laser-scene.css'
import { Four, Utils } from '../packages'
// import Obj from '../packages/Obj'
// import ModelObj from '../packages/ModelObj'
import * as THREE from 'three'
import VueLabel from './VueLabel.vue'
import Vue from 'vue'

import { MachineBed, LoadMachine, UnLoadMachine } from './model'
import { LOAD_NAME, UNLOAD_NAME, BED_NAME, LOAD_MOVE_NAME, UNLOAD_MOVE_NAME } from './model'
import { ModelObj } from '../packages'
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
      originSize: {},
      plane: null
    }
  },
  mounted() {
    this.four = new Four(this.$refs.container)
    const bed = new MachineBed({ z: 6 })
    this.four.add(bed)
    const loadM = new LoadMachine({ x: 12, y: -24, z: 6 })
    this.four.add(loadM)
    const unloadM = new UnLoadMachine({ x: 12, y: 24, z: 6 })
    this.four.add(unloadM)

    this.plane = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 1), new THREE.MeshPhongMaterial({
      color: 0x808080, // 基础颜色
      specular: 0xffffff, // 镜面高光颜色
      shininess: 100, // 镜面高光强度
    }))
    this.plane.position.set(-20, -30, 0)
    this.four.add(this.plane)
    // const shelf = new ModelObj({z: 15}, null, 'model/wareHouse/shelf.obj')
    // this.four.add(shelf)
    // for (let i of pos) {
    //   const obj = new ModelObj(i, null, i.path)
    //   this.four.add(obj)
    //   const element = document.createElement('div');
    //   element.style.backgroundColor = 'gray';
    //   element.innerText = i.path;
    //   this.four.add2DLabel(obj,element)
    // }
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
    // const downfix = new ModelObj({ x: 0, y: 0, z: 40 }, null, 'model/down/fix.obj')
    // this.four.add(downfix)
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
    async loadPlane() {
      const LoadObj = this.four.objs.find(val => val.modelType === LOAD_NAME)
      console.log('data', this.plane, LoadObj);

      // 将需要移动的装置从里面拆出来
      const moveObj = LoadObj.children.find(val => val.modelType === LOAD_MOVE_NAME)
      if (moveObj) {
        let worldPosition = new THREE.Vector3();
        moveObj.getWorldPosition(worldPosition);
        LoadObj.remove(moveObj);
        moveObj.position.copy(worldPosition)
        console.log(moveObj);
        this.four.scene.add(moveObj)
      }
      let originSize = Utils.getOriginSize(moveObj)
      await Utils.moveTo(moveObj, { ...this.plane.position, z: this.plane.position.z + originSize.z * moveObj.scale.z / 2 + 1 })
      moveObj.attach(this.plane)

      const BedObj = this.four.objs.find(val => val.modelType === BED_NAME)
      await Utils.moveTo(moveObj, {
        ...BedObj.position,
        z: BedObj.position.z + originSize.z * moveObj.scale.z / 2 + 1
      },
        { order: ['z', 'y', 'x'] })
    },
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

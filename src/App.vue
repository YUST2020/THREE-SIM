<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div>
    <button style="position: absolute;bottom: 30px;right: 130px;" @click="loadPlane">上料</button>
    <button style="position: absolute;bottom: 30px;right: 80px;" @click="unLoadPlane">下料</button>
    <button style="position: absolute;bottom: 30px;right: 30px;" @click="save">保存</button>
  </div>
</template>

<script>
// import { Four,Obj,ModelObj } from '../dist/laser-scene.umd.min.js'
// import '../dist/laser-scene.css'
import { Four, Utils } from '../packages'
import Obj from '../packages/classes/Obj'
// import ModelObj from '../packages/ModelObj'
import * as THREE from 'three'
import VueLabel from './VueLabel.vue'
import Vue from 'vue'

import { MachineBed, LoadMachine, UnLoadMachine } from './model'
import {
  LOAD_NAME, UNLOAD_NAME, BED_NAME, LOAD_MOVE_NAME, UNLOAD_MOVE_NAME, LOAD_MOVE_HAND_NAME,
  UNLOAD_MOVE_HAND_NAME, UNLOAD_MOVE_HAND_LEFT, UNLOAD_MOVE_HAND_RIGHT
} from './model'
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
      plane: null,

    }
  },
  mounted() {
    this.four = new Four(this.$refs.container, { isEdit: true })
    // this.four.setAddableList([
    //   { title: '机床', subTitle: '液压高低台', class: MachineBed },
    //   { title: '上料机器', subTitle: '上料机器', class: LoadMachine },
    //   { title: '下料机器', subTitle: '下料机器', class: UnLoadMachine }
    // ])
    const bed = new MachineBed({ z: 0, bottom: true })
    this.four.add(bed)
    // const loadM = new LoadMachine({ x: 12, y: -24, z: 6 })
    // this.four.add(loadM)
    // const unloadM = new UnLoadMachine({ x: 12, y: 24, z: 6 })
    // this.four.add(unloadM)
    const a = new Obj({},{top:true})
    a.add(new THREE.Mesh(new THREE.BoxGeometry(15, 25, 60), new THREE.MeshBasicMaterial({
      color: 0x4D515D,
      transparent: true,
      opacity: 0.5
    })))
    this.four.add(a)
    const b = new Obj()
    b.add(new THREE.Mesh(new THREE.BoxGeometry(25, 15, 60), new THREE.MeshBasicMaterial({
      color: 0x4D515D,
      transparent: true,
      opacity: 0.5
    })))
    b.initBoundingBox();
    a.initBoundingBox();
    a.add(b)
    this.plane = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 1), new THREE.MeshPhongMaterial({
      color: 0x808080, // 基础颜色
      specular: 0xffffff, // 镜面高光颜色
      shininess: 100, // 镜面高光强度
    }))
    this.plane.position.set(-20, -30, 0)
    this.four.scene.add(this.plane)
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
  beforeDestroy() {
    this.four.destroy()
  },
  methods: {
    async loadPlane() {
      const LoadObj = this.four.getObjectByName(LOAD_NAME)
      console.log('data', this.plane, LoadObj);

      // 将需要移动的装置从里面拆出来
      const moveObj = LoadObj.getObjectByName(LOAD_MOVE_NAME)
      if (moveObj) {
        this.four.attach(moveObj)
      }
      const moveObjPos = new THREE.Vector3()
      moveObjPos.copy(moveObj.position)
      const handObj = moveObj.getObjectByName(LOAD_MOVE_HAND_NAME)
      let originSize = Utils.getBoundingSize(moveObj)
      // 上料装置到达目标位置
      await Utils.moveObj(moveObj, {
        x: this.plane.position.x,
        y: this.plane.position.y
      })
      // 下料抓手下降到板材位置
      let downLen = moveObj.position.z - this.plane.position.z - originSize.z / 2 - 1
      await Utils.moveObjBySelf(handObj, { z: -downLen })
      // 抓住板材后上升
      handObj.attach(this.plane)
      await Utils.moveObjBySelf(handObj, { z: downLen })
      // 移动到机床位置
      const BedObj = this.four.getObjectByName(BED_NAME)
      await Utils.moveObj(moveObj, {
        x: BedObj.position.x,
        y: BedObj.position.y
      }, { order: ['x', 'y'] })
      downLen = moveObj.position.z - BedObj.position.z - originSize.z / 2 - 1
      // 放下板材，回归初始位置
      await Utils.moveObjBySelf(handObj, { z: -downLen })
      this.four.attach(this.plane)
      await Utils.moveObjBySelf(handObj, { z: downLen })
      await Utils.moveObj(moveObj, moveObjPos, { order: ['z', 'y', 'x'] })
    },
    async unLoadPlane() {
      const LoadObj = this.four.getObjectByName(LOAD_NAME)
      console.log('data', this.plane, LoadObj);

      // 将需要移动的装置从里面拆出来
      const moveObj = LoadObj.getObjectByName(LOAD_MOVE_NAME)
      if (moveObj) {
        this.four.attach(moveObj)
      }
      const moveObjPos = new THREE.Vector3()
      moveObjPos.copy(moveObj.position)
      const handObj = moveObj.getObjectByName(LOAD_MOVE_HAND_NAME)
      let originSize = Utils.getBoundingSize(moveObj)
      // 上料装置到达目标位置
      await Utils.moveObj(moveObj, {
        x: this.plane.position.x,
        y: this.plane.position.y
      })
      // 下料抓手下降到板材位置
      let downLen = moveObj.position.z - this.plane.position.z - originSize.z / 2 - 1
      await Utils.moveObjBySelf(handObj, { z: -downLen })
      // 抓住板材后上升
      handObj.attach(this.plane)
      await Utils.moveObjBySelf(handObj, { z: downLen })
      // 移动到机床位置
      const BedObj = this.four.getObjectByName(BED_NAME)
      await Utils.moveObj(moveObj, {
        x: BedObj.position.x,
        y: BedObj.position.y
      }, { order: ['x', 'y'] })
      downLen = moveObj.position.z - BedObj.position.z - originSize.z / 2 - 1
      // 放下板材，回归初始位置
      await Utils.moveObjBySelf(handObj, { z: -downLen })
      this.four.attach(this.plane)
      await Utils.moveObjBySelf(handObj, { z: downLen })
      await Utils.moveObj(moveObj, moveObjPos, { order: ['z', 'y', 'x'] })
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

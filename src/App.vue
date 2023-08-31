<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;"></div> 
    <div v-if="curObj" style="background-color: #fff;position: absolute;right: 100px;top: 100px">
      长<input :value="curObj.scale.x * originSize.x" @input="(e) => lenInput(e,'x')"><br>
      宽<input :value="curObj.scale.y * originSize.y" @input="(e) => lenInput(e,'y')"><br>
      高<input :value="curObj.scale.z * originSize.z" @input="(e) => lenInput(e,'z')"><br>
      x<input v-model="curObj.position.x"><br>
      y<input v-model="curObj.position.y"><br>
      z<input v-model="curObj.position.z"><br>
      x旋转<input :value="Math.round(180 * curObj.rotation.x / Math.PI)" @input="(e) => rotateInput(e,'x')"><br>
      y旋转<input :value="Math.round(180 * curObj.rotation.y / Math.PI)" @input="(e) => rotateInput(e,'y')"><br>
      z旋转<input :value="Math.round(180 * curObj.rotation.z / Math.PI)" @input="(e) => rotateInput(e,'z')"><br>
      x缩放<input v-model="curObj.scale.x"><br>
      y缩放<input v-model="curObj.scale.y"><br>
      z缩放<input v-model="curObj.scale.z"><br>
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
      four: {},
      curObj: null,
      originSize: {}
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
    // model.moveTo({x: 20,y:20,z: 20})
    
    this.four.addEvent('selectChange', (curObj) => {
      this.curObj = curObj
      if (curObj) {
        this.originSize = Four.getOriginSize(this.curObj)
      }
    })
  },
  methods: {
    lenInput(e, axis) {
      if (e.target.value)
        this.curObj.scale[axis] = Number(e.target.value) / this.originSize[axis]
    },
    rotateInput(e,axis) {
      if (e.target.value)
        this.curObj.rotation[axis] = e.target.value * Math.PI / 180
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
body,html {
  margin: 0;
  padding: 0;
}
</style>

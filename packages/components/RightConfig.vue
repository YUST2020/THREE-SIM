<template>
    <div v-if="curObj" style="background-color: #fff;position: absolute;right: 100px;top: 100px">
        长<input :value="curObj.scale.x * originSize.x" @input="(e) => lenInput(e, 'x')"><br>
        宽<input :value="curObj.scale.y * originSize.y" @input="(e) => lenInput(e, 'y')"><br>
        高<input :value="curObj.scale.z * originSize.z" @input="(e) => lenInput(e, 'z')"><br>
        x<input v-model="curObj.position.x"><br>
        y<input v-model="curObj.position.y"><br>
        z<input v-model="curObj.position.z"><br>
        x旋转<input :value="Math.round(180 * curObj.rotation.x / Math.PI)" @input="(e) => rotateInput(e, 'x')"><br>
        y旋转<input :value="Math.round(180 * curObj.rotation.y / Math.PI)" @input="(e) => rotateInput(e, 'y')"><br>
        z旋转<input :value="Math.round(180 * curObj.rotation.z / Math.PI)" @input="(e) => rotateInput(e, 'z')"><br>
        x缩放<input v-model="curObj.scale.x"><br>
        y缩放<input v-model="curObj.scale.y"><br>
        z缩放<input v-model="curObj.scale.z"><br>
    </div>
</template>

<script>
import { getOriginSize } from '../utils/object'
export default {
    data() {
        return {
            curObj: null,
            originSize: {}
        }
    },
    methods: {
        init(curObj) {
            this.curObj = curObj
            if (curObj) {
        this.originSize = getOriginSize(this.curObj)
      }
        },
        lenInput(e, axis) {
            if (e.target.value)
                this.curObj.scale[axis] = Number(e.target.value) / this.originSize[axis]
        },
        rotateInput(e, axis) {
            if (e.target.value !== '')
                this.curObj.rotation[axis] = Number(e.target.value) * Math.PI / 180
        }
    }
}
</script>

<style lang="less" scoped></style>
import { Obj, Utils } from '../packages'
import * as THREE from 'three'
export const BED_NAME = 'BED' // 机床

export const LOAD_NAME = 'LOAD' // 上料装置整体
export const LOAD_MOVE_NAME = 'LOAD_MOVE' // 上料移动装置
export const LOAD_MOVE_HAND_NAME = 'LOAD_HAND' // 上料上下抓手

export const UNLOAD_NAME = 'UNLOAD' // 下料装置整体
export const UNLOAD_MOVE_NAME = 'UNLOAD_MOVE' // 下料移动装置
export const UNLOAD_MOVE_HAND_NAME = 'UNLOAD_HAND' // 下料上下抓手
export const UNLOAD_MOVE_HAND_LEFT = 'UNLOAD_LEFT' // 下料左抓钩
export const UNLOAD_MOVE_HAND_RIGHT = 'UNLOAD_RIGHT' // 下料右抓钩

const rotateToZ = (obj) => {
    obj.rotation.x = Math.PI / 2
}
// 料库
export class Shelf extends Obj {
    constructor(position, options) {
        super(position, { ...options })
        Utils.getModel('').then(res => {
            this.add(res)
            this.initBoundingBox()
        })
    }
}
// 机床
export class MachineBed extends Obj {
    constructor(position, options) {
        super(position, { ...options })
        this.name = BED_NAME
        Utils.getModel('model/machineBed.obj', 0.1).then(res => {
            rotateToZ(res)
            console.log(res.scale);
            this.add(res)
            this.initBoundingBox()
        })
    }
}
// 上料机器
export class LoadMachine extends Obj {
    constructor(position, options) {
        super(position, { ...options })
        this.name = LOAD_NAME
        // 上料装置
        Promise.all([
            Utils.getModel('model/up/fix.obj'),
            Utils.getModel('model/up/upZ.obj'),
            Utils.getModel('model/outCar.obj')
        ])
            .then(list => {
                // 夹持部分
                const [fix, upZ, outCar] = list
                const moveObj = new THREE.Object3D()
                moveObj.position.set(0, 0, 12)
                moveObj.name = LOAD_MOVE_NAME
                rotateToZ(fix)
                rotateToZ(upZ)
                upZ.name = LOAD_MOVE_HAND_NAME
                moveObj.add(fix,upZ)
               
                this.add(moveObj)
                // 出料车
                rotateToZ(outCar)
                outCar.position.set(0, 0, -4)
                this.add(outCar)

                this.initBoundingBox()
            })
    }
}
// 下料机器
export class UnLoadMachine extends Obj {
    constructor(position, options) {
        super(position, { ...options })
        this.name = UNLOAD_NAME
        // 下料装置
        Promise.all([
            Utils.getModel('model/down/fix.obj'),
            Utils.getModel('model/down/downZ.obj', false),
            Utils.getModel('model/down/left.obj', false),
            Utils.getModel('model/down/right.obj', false),
            Utils.getModel('model/endCar.obj')
        ])
            .then(list => {
                const [fix, downZ, left, right, endCar] = list
                // 下料装置
                rotateToZ(fix)
                fix.position.set(0, 0, 12)
                fix.name = UNLOAD_MOVE_NAME
                left.position.z = -10
                right.position.z = -10
                downZ.name = UNLOAD_MOVE_HAND_NAME
                downZ.add(left)
                downZ.add(right)
                fix.add(downZ)
                this.add(fix)
                // 出料车
                rotateToZ(endCar)
                endCar.position.z = -4
                this.add(endCar)
                this.initBoundingBox()
            })
    }
}
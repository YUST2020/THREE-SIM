import { Obj, Utils } from '../packages'
import * as THREE from 'three'
export const LOAD_NAME = 'LOAD'
export const UNLOAD_NAME = 'UNLOAD'
export const BED_NAME = 'BED'
export const LOAD_MOVE_NAME = 'LOAD_MOVE'
export const UNLOAD_MOVE_NAME = 'UNLOAD_MOVE'

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
        this.modelType = BED_NAME
        Utils.getModel('model/machineBed.obj').then(res => {
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
        this.modelType = LOAD_NAME
        // 上料装置
        Promise.all([
            Utils.getModel('model/up/fix.obj'),
            Utils.getModel('model/up/upZ.obj', false),
            Utils.getModel('model/outCar.obj')
        ])
            .then(list => {
                // 夹持部分
                const [fix, upZ, outCar] = list
                rotateToZ(fix)
                fix.position.set(0, 0, 12)
                fix.modelType = LOAD_MOVE_NAME
                fix.add(upZ)
                this.add(fix)
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
        this.modelType = UNLOAD_NAME
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
                fix.modelType = UNLOAD_MOVE_NAME
                left.position.z = -10
                right.position.z = -10
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
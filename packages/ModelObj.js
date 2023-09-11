import Obj from './Obj'
import { getModel } from './utils/object';
export default class ModelObj extends Obj {
    constructor(position, options, path) {
        super(position,{ path,...options })
        getModel(path).then(res => {
            this.add(res)
            this.initBoundingBox()
        })
    }
}
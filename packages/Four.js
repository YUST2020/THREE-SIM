import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "./utils/TransformControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import Vue from 'vue'
import TopOptions from './components/TopOptions'
import LeftOptions from './components/LeftOptions.vue'
import TWEEN from "@tweenjs/tween.js"
import Stats from 'three/addons/libs/stats.module.js'
// import RightConfig from './components/RightConfig.vue'
import Utils from './utils/object'
import ResourceTracker from "./utils/TrackResource";
import { ViewHelper } from './utils/ViewHelper';
// 设置边框，选中标签显示状态
const batchSetChildrenVisible = (obj, show, hover = false) => {
  if (!obj) return
  for (let child of obj.children) {
    // 设置选中时外边框的显隐
    if (hover ? child.isHoverBox : child.isSelectBox) {
      child.visible = show;
    }
  }
};
const clock = new THREE.Clock();
export default class Four {
  constructor(dom, options = {}) {
    this.dom = dom; // 外围dom元素
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.css2dRenderer = null;
    this.css3dRenderer = null;
    this.controls = null; // 场景拖动控制器
    this.transformControls = null;
    this.curObj = null; // 当前选中object
    this.keyboard = {}; // 记录当前已按下的按钮
    this.configInstance = null; // 右侧菜单的实例对象
    this.isEdit = options.isEdit || false; // 是否是编辑状态
    this.objs = new Proxy([], {
      set: (target, property, value) => {
        target[property] = value;
        this.leftVueInstance?.setObjs(target)
        return true;
      }
    }) // 当前场景种的全部对象
    this.state = {
      mode: 'translate'
    }
    this.events = {}
    this.topVueInstance = null // 顶部状态栏的vue实例
    this.leftVueInstance = null // 左侧状态栏的vue实例
    this.resMgr = new ResourceTracker(); // 记录模型的信息，用于销毁时清理内存
    this.track = this.resMgr.track.bind(this.resMgr); // 追踪模型的方法

    // 挂载左上角性能监视器
    if (options.stats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.domElement);
      this.stats.setMode(0)
    }

    this.init();
    this.initViewHelper()
    
    this.initEvent();
    this.animate();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111216); // 添加背景颜色

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.dom.clientWidth / this.dom.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(-30, -35, 60);
    this.camera.up.set(0, 0, 1)

    let ambient = new THREE.AmbientLight(0x444444, 3); // 添加光源  颜色和光照强度
    let axisHelper = new THREE.AxesHelper(600); // 添加辅助坐标系 参数位辅助坐标系的长度
    this.scene.add(ambient, axisHelper); // 向场景中添加光源 和 辅助坐标系

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight.position.set(0, 0, 60); // 光源的方向
    this.scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight2.position.set(0, 60, 0); // 光源的方向
    this.scene.add(directionalLight2);
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight3.position.set(60, 0, 0); // 光源的方向
    this.scene.add(directionalLight3);
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight4.position.set(-60, 0, 0); // 光源的方向
    this.scene.add(directionalLight4);
    const directionalLight5 = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight5.position.set(0, -60, 0); // 光源的方向
    this.scene.add(directionalLight5);
    const directionalLight6 = new THREE.DirectionalLight(0xffffff, 5); // 光源颜色和强度
    directionalLight6.position.set(0, 0, -60); // 光源的方向
    this.scene.add(directionalLight6);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); // 加入去除锯齿功能
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
    this.renderer.autoClear = false
    this.dom.appendChild(this.renderer.domElement);

    const initRenderer = (renderer) => {
      renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0px";
      renderer.domElement.style.left = "0px";
      renderer.domElement.style["pointer-events"] = "none";
      this.dom.appendChild(renderer.domElement);
    };
    // css2d渲染器
    this.css2dRenderer = new CSS2DRenderer();
    initRenderer(this.css2dRenderer);
    // css3d渲染器
    this.css3dRenderer = new CSS3DRenderer();
    initRenderer(this.css3dRenderer);
    // 添加鼠标控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(50,0,0);
    this.controls.enableZoom = true;
    this.controls.enableKeys = true;
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.1;

    // 添加变换控制器
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.controls.enabled = !event.value;
      this.controls.enableZoom = !event.value;
    });
    this.transformControls.translationSnap = 0.01
    this.transformControls.rotationSnap = Math.PI / 12
    this.scene.add(this.transformControls);

    // 添加地面
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240, 240),
      new THREE.MeshBasicMaterial({ color: 0x1E2229, side: THREE.DoubleSide })
    );
    plane.position.x = 60;
    this.scene.add(plane);
    // 地面边框
    const borderGeometry = new THREE.PlaneGeometry(242, 242, 242);
    const borderColor = new THREE.Color(0x152F61);
    const borderMaterial = new THREE.LineBasicMaterial({ color: borderColor, linewidth: 2 });
    const border = new THREE.LineSegments(new THREE.EdgesGeometry(borderGeometry), borderMaterial);
    border.position.x = 60;
    this.scene.add(border);

    // 选中目标时需要的渲染器
    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.IntType,
      format: THREE.RGBAIntegerFormat,
      internalFormat: 'RGBA32I',
    });

    this.initVueInstance()
  }
  // 挂载vue组件
  initVueInstance() {
    const mountVueToDom = (comp, options = {}) => {
      const container = document.createElement('div')
      this.dom.appendChild(container)
      const vueComp = Vue.extend(comp);
      const instance = new vueComp(options)
      instance.$mount(container)
      return instance
    }
    if (this.isEdit) {
      this.topVueInstance = mountVueToDom(TopOptions, {
        propsData: {
          state: this.state,
          emitMethods: {
            setMode: (mode) => {
              this.state.mode = mode
              this.transformControls.setMode(mode)
            },
            getObj: () => this.curObj,
            del: () => {
              const index = this.objs.findIndex(val => val.id === this.curObj.id)
              if (index !== -1) {
                this.transformControls.detach()
                this.objs.splice(index, 1)
                this.scene.remove(this.curObj)
                this.curObj = null
              }
            }
          }
        }
      })
      this.leftVueInstance = mountVueToDom(LeftOptions, {
        propsData: {
          emitMethods: {
            add: (obj) => { this.add(obj) },
            setSelected: (obj) => { this.setSelected(obj) }
          }
        }
      })
    }
    // this.configInstance = mountVueToDom(RightConfig)
  }
  // 初始化viewHelper
  initViewHelper() {
    this.viewHelper = new ViewHelper( this.camera, this.dom )
    // let viewHelperDiv=document.createElement('div')
    //     viewHelperDiv.style.position='absolute'
    //     viewHelperDiv.style.bottom=0
    //     viewHelperDiv.style.right=0
    //     viewHelperDiv.style.width='128px'
    //     viewHelperDiv.style.height='128px'
    //     viewHelperDiv.style.zIndex = 2
    //     this.dom.appendChild(viewHelperDiv);
    //     viewHelperDiv.addEventListener( 'mousedown', ( event ) => {
    //         event.stopPropagation();
    //         console.log(event,this.viewHelper);
    //         this.viewHelper.handleClick( event );
    //     } );

  }
  // 初始化事件
  initEvent() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // 移动事件防抖
    let moveTimer = null
    // 标识当前鼠标位置对应的可交互物体
    let object = null

    // 鼠标移动事件处理函数
    const onDocumentMouseMove = (event) => {
      if (moveTimer) {
        return
      } else {
        moveTimer = setTimeout(() => {
          clearTimeout(moveTimer)
          moveTimer = null
        }, 100);
      }
      // 更新鼠标相对于容器的坐标
      mouse.x = (event.offsetX / this.dom.clientWidth) * 2 - 1;
      mouse.y = -(event.offsetY / this.dom.clientHeight) * 2 + 1;
      // 更新鼠标当前的锁定元素
      raycaster.setFromCamera(mouse, this.camera);
      // 以包围盒作为物体识别的标识
      const checkObjs = []
      // 获取可触发识别的物体
      const getIdentifyBox = (obj) => {
        if (obj.children?.length > 0) {
          for (let child of obj.children) {
            if (child.isBoundingBox) {
              checkObjs.push(child)
            }
            getIdentifyBox(child)
          }
        }
      }
      getIdentifyBox(this.scene)

      let intersects = raycaster.intersectObjects(checkObjs, false)
      batchSetChildrenVisible(object, false, true)
      // 识别物体带有top属性优先选中
      intersects.sort((a,b) => {
        const bIndex = b.object.topIndex ?? 1
        const aIndex = a.object.topIndex ?? 1
        return bIndex - aIndex
      })
      object = intersects.length > 0 ? intersects[0].object.parent : null
      batchSetChildrenVisible(object, true, true)
    };
    this.dom.addEventListener("mousemove", onDocumentMouseMove, false);
    const onDocumentClick = () => {
      // 选取第一个可拖拽物体并对其执行选中
      console.log("object:", object);
      this.setSelected(object)
      // this.configInstance.init(this.curObj)
    };
    this.dom.addEventListener("click", onDocumentClick, false);
    // 监听当前按下的按键，用于控制相机移动
    document.addEventListener('keydown', (event) => {
      this.keyboard[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keyboard[event.code] = false;
    })
  }
  // #region 暴露给外部调用的方法
  // 初始化左侧可添加的列表 title: 标题 subTitle: 副标题 class 继承obj的类
  setAddableList(list) {
    this.leftVueInstance.setAddableList(list)
  }
  // 添加2d标签
  // obj: 需要添加至的obj dom：dom元素 position：相对定位
  add2DLabel(obj, dom, pos) {
    const position = Object.assign({ x: 0, y: 0, z: 0 }, pos)
    const labelObject = new CSS2DObject(dom);
    const { x, y, z } = position
    labelObject.position.set(x, y, z)
    obj.add(labelObject)
    return labelObject
  }
  // 挂载事件 该处事件由内部dispatch触发
  addEvent(name, func) {
    if (this.events[name]) {
      this.events[name].push(func)
    } else {
      this.events[name] = [func]
    }
  }
  // 根据name获取场景中的obj
  getObjectByName(str) {
    return this.objs.find(val => val.name === str)
  }
  // 添加obj到场景内
  add(obj) {
    this.track(obj)
    this.scene.add(obj)
    this.objs.push(obj)
  }
  // attach 进入场景，用于解绑
  attach(obj) {
    this.scene.attach(obj)
  }
  // 设置当前选中的对象
  setSelected(object) {
    // 先把之前的框给去掉
    if (this.curObj) {
      batchSetChildrenVisible(this.curObj, false);
    }
    this.dispatch('selectChange', object, this.curObj)
    if (object) {
      batchSetChildrenVisible(object, true);
      this.curObj = object;
      if (this.isEdit) {
        // 如果是不可编辑物体
        if (object.static) {
          batchSetChildrenVisible(object, false);
          this.curObj = null
        } else {
          this.transformControls.attach(this.curObj);
        }
      }
    } else {
      this.isEdit && this.transformControls.detach()
      batchSetChildrenVisible(this.curObj, false);
      this.curObj = null
    }
  }
  // 销毁当前实例
  destroy() {
    try {
      this.scene.clear();
      this.resMgr && this.resMgr.dispose()
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.content = null;
      cancelAnimationFrame(this.animationID) // 去除animationFrame
      let gl = this.renderer.domElement.getContext("webgl");
      gl && gl.getExtension("WEBGL_lose_context").loseContext();
    } catch (e) {
      console.log(e)
    }
  }
  // #endregion

  // #region 静态工具方法

  // 获取包围盒的大小
  static getBoundingSize(obj) { return Utils.getBoundingSize(obj) }

  // 获取没被缩放前的包围盒的大小
  static getOriginSize(obj) { return Utils.getOriginSize(obj) }

  // 将add了多个物体的Object居中
  static centerObject3D() { return Utils.centerObject3D(...arguments) }

  // 获取模型的Object path: 路径 scale: 是否缩放至10
  static getModel() { return Utils.getModel(...arguments) }

  // 世界坐标系根据指定轴顺序进行移动
  static moveObj() { return Utils.moveObj(...arguments) }

  // 根据自身来进行相对运动
  static moveObjBySelf() { return Utils.moveObjBySelf(...arguments) }

  // 根据物体底部中心的坐标移动物体
  static setBottomPosition() { return Utils.setBottomPosition(...arguments) }

  // 移动到物体的对应轴上
  static moveToObjectTop() { return Utils.moveToObjectTop(...arguments) }
  
  // 将obj缩放到固定尺寸
  static scaleToSize() { return Utils.scaleToSize(...arguments) }
  // #endregion

  // 触发events中事件
  dispatch(name) {
    if (Array.isArray(this.events[name])) {
      for (let func of this.events[name]) {
        func(...Array.prototype.slice.call(arguments, 1))
      }
    }
  }
  animate() {
    this.animationID = requestAnimationFrame(() => this.animate());
    const initZ = this.camera.position.z
    const direction = new THREE.Vector3(); // 当前朝向的向量
    this.camera.getWorldDirection(direction);
    direction.normalize();
    const moveSpeed = 0.5
    if (this.keyboard['KeyW']) this.camera.position.addScaledVector(direction, moveSpeed)
    if (this.keyboard['KeyS']) this.camera.position.addScaledVector(direction, -moveSpeed)
    const vertical = new THREE.Vector3();
    vertical.crossVectors(direction, this.camera.up).normalize();
    if (this.keyboard['KeyA']) this.camera.position.addScaledVector(vertical, -moveSpeed);
    if (this.keyboard['KeyD']) this.camera.position.addScaledVector(vertical, moveSpeed);
    this.camera.position.z = initZ
    if (this.keyboard['Space']) this.camera.position.z += moveSpeed;

    this.controls.update()
    const delta = clock.getDelta();
            if ( this.viewHelper.animating === true ) {
                this.viewHelper.update( delta );
            }
    // 渲染场景
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera);
    this.viewHelper?.render(this.renderer)
    this.css2dRenderer.render(this.scene, this.camera);
    this.css3dRenderer.render(this.scene, this.camera);
    
    this.stats?.update();
    TWEEN.update();
  }
}

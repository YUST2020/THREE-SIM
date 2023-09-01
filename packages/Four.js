import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "./TransformControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import Vue from 'vue'
import TopOptions from './TopOptions'
import LeftOptions from './LeftOptions.vue'
import TWEEN from "@tweenjs/tween.js"
import Stats from 'three/addons/libs/stats.module.js'
import RightConfig from './RightConfig.vue'
import { getBoundingSize, getOriginSize } from './utils/object'


export default class Four {
  constructor(dom) {
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
    this.state = {
      mode: 'translate'
    }
    this.events = {}
    this.stats = new Stats();

    document.body.appendChild(this.stats.domElement);
    this.stats.setMode(0)
    this.init();
    this.initEvent();
    this.animate();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2E3138); // 添加背景颜色

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.dom.clientWidth / this.dom.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 10);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.up.set(0, 0, 1)

    let ambient = new THREE.AmbientLight(0x444444, 3); // 添加光源  颜色和光照强度
    let axisHelper = new THREE.AxesHelper(600); // 添加辅助坐标系 参数位辅助坐标系的长度
    this.scene.add(ambient, axisHelper); // 向场景中添加光源 和 辅助坐标系

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); // 加入去除锯齿功能
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
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
    this.transformControls.translationSnap = 1
    this.transformControls.rotationSnap = Math.PI / 12
    this.scene.add(this.transformControls);

    // 添加地面
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0x1E2229, side: THREE.DoubleSide })
    );
    // plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
    // 地面边框
    const borderGeometry = new THREE.PlaneGeometry(41, 41, 41); // 大一点的几何体
    const borderColor = new THREE.Color(0x152F61); // 蓝色边框颜色
    const borderMaterial = new THREE.LineBasicMaterial({ color: borderColor, linewidth: 2 });
    const border = new THREE.LineSegments(new THREE.EdgesGeometry(borderGeometry), borderMaterial);
    this.scene.add(border);

    // 选中目标时需要的渲染器
    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.IntType,
      format: THREE.RGBAIntegerFormat,
      internalFormat: 'RGBA32I',
    });

    this.initOptions()
  }
  // 挂载vue组件
  initOptions() {
    const mountVueToDom = (comp, options = {}) => {
      const container = document.createElement('div')
      this.dom.appendChild(container)
      const vueComp = Vue.extend(comp);
      const instance = new vueComp(options)
      instance.$mount(container)
      return instance
    }
    mountVueToDom(TopOptions, {
      propsData: {
        state: this.state,
        emitMethods: {
          setMode: (mode) => {
            this.state.mode = mode
            this.transformControls.setMode(mode)
          }
        }
      }
    })
    mountVueToDom(LeftOptions)
    this.configInstance = mountVueToDom(RightConfig)
  }
  initEvent() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let timer = null
    // 防止拖拽和点击事件同步触发 100ms内的拖拽视为点击，否则阻止点击事件
    this.controls.addEventListener('start', () => {
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, 100);
    })
    // 移动事件防抖
    let moveTimer = null
    // 标识当前鼠标位置对应的可交互物体
    let object = null
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
      console.log(event, mouse.x, mouse.y, event.clientX, event.clientY, this.dom.clientWidth, this.dom.clientHeight);
      // 更新鼠标当前的锁定元素
      raycaster.setFromCamera(mouse, this.camera);
      // 以包围盒作为物体识别的标识
      const checkObjs = []
      for (let outer of this.scene.children) {
        for (let i of outer.children) {
          if (i.type === 'Box3Helper') {
            checkObjs.push(i)
          }
        }
      }
      let intersects = raycaster.intersectObjects(checkObjs, false)
      batchSetChildrenVisible(object, false, true)
      object = null
      for (const val of intersects) {
        let cur = val.object
        if (cur.type !== 'Box3Helper') {
          continue
        }
        while (cur && !object) {
          if (cur.isOuter) {
            object = cur
            break
          }
          cur = cur.parent
        }
        if (object) {
          break
        }
      }
      batchSetChildrenVisible(object, true, true)
    };
    this.dom.addEventListener("mousemove", onDocumentMouseMove, false);
    const onDocumentClick = () => {
      if (!timer) return
      if (object) {
        // 选取第一个可拖拽物体并对其执行选中
        console.log("object:", object);
        // 当变更选中目标时隐藏之前的线框
        if (this.curObj && object && this.curObj !== object) {
          batchSetChildrenVisible(this.curObj, false);
        }
        batchSetChildrenVisible(object, true);
        this.curObj = object;
        this.transformControls.attach(this.curObj);
        // 2d

        console.log(this.curObj);
      } else {
        this.transformControls.detach()
        batchSetChildrenVisible(this.curObj, false);
        this.curObj = null
      }
      this.dispatch('selectChange', this.curObj)
      this.configInstance.init(this.curObj)
    };
    console.log(this.dom);
    this.dom.addEventListener("click", onDocumentClick, false);
    // 监听当前按下的按键，用于控制相机移动
    document.addEventListener('keydown', (event) => {
      this.keyboard[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keyboard[event.code] = false;
    })
  }
  // 添加obj到场景内
  add(obj) {
    this.scene.add(obj);
  }
  // 添加2d标签
  // obj: 需要添加至的obj dom：dom元素 position：相对定位
  add2DLabel(obj, dom, position = { x: 0, y: 0, z: 0 }) {
    const labelObject = new CSS2DObject(dom);
    const { x, y, z } = position
    labelObject.position.set(x, y, z);
    obj.add(labelObject);
  }
  addEvent(name, func) {
    if (this.events[name]) {
      this.events[name].push(func)
    } else {
      this.events[name] = [func]
    }
  }
  dispatch(name) {
    if (Array.isArray(this.events[name])) {
      for (let func of this.events[name]) {
        func(...Array.prototype.slice.call(arguments, 1))
      }
    }
  }
  animate() {
    requestAnimationFrame(() => this.animate());
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
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
    this.css2dRenderer.render(this.scene, this.camera);
    this.css3dRenderer.render(this.scene, this.camera);
    this.stats.update();
    TWEEN.update();
  }
  // 获取包围盒的大小
  static getBoundingSize(obj) {
    return getBoundingSize(obj);
  }
  // 获取没被缩放前的包围盒的大小
  static getOriginSize(obj) {
    return getOriginSize(obj)
  }
}

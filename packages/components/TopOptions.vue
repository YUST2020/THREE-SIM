<template>
    <div class="options-outer" @click.stop>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'translate'}" @click="setMode('translate')">
            <svg-icon iconClass="rotate"></svg-icon>
            <div class="top-tips">{{ t('RotateMode') }}</div>
        </div>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'scale'}" @click="setMode('scale')">
            <svg-icon iconClass="scale"></svg-icon>
            <div class="top-tips">{{ t('ZoomMode')}}</div>
        </div>
        <div class="options-btn">
            <svg-icon iconClass="mirror"></svg-icon>
            <div class="top-tips">{{ t('mirror') }}</div>
            <div class="top-tips" style="top: 64px">
                <div class="option-child-btn flex-center" @click="mirror('x')">
                    <svg-icon iconClass="diamond" style="font-size: 24px;"></svg-icon>X{{ t('directionMirror') }}</div>
                <div class="option-child-btn flex-center" @click="mirror('y')">
                    <svg-icon iconClass="diamond" style="font-size: 24px;"></svg-icon>Y{{ t('directionMirror') }}</div>
                <div class="option-child-btn flex-center" @click="mirror('z')">
                    <svg-icon iconClass="diamond" style="font-size: 24px;"></svg-icon>X{{ t('directionMirror') }}</div>
            </div>
        </div>
        <!-- <div class="options-btn" @click="delObj">
            <svg-icon iconClass="bin"></svg-icon>
            <div class="top-tips">删除</div>
        </div> -->
    </div>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
import { t } from '../lang/index'
export default {
  components: { SvgIcon },
    props: ['emitMethods','state'],
    data() {
        return {
            curOption: ''
        }
    },
    mounted() {
        
    },
    methods: {
        t() {
            return t(...arguments)
        },
        setMode(mode) {
            this.emitMethods.setMode(mode)
        },
        mirror(axis) {
            const obj = this.emitMethods.getObj()
            if (obj) {
                obj.scale[axis] = -obj.scale[axis]
            }
        },
        delObj() {
            this.emitMethods.del()
        }
    }
}
</script>

<style lang="less" scoped>
.options-outer {
    position: absolute;
    top: 50px;
    left: calc(50% - 122px);
    background: #21232A;
    padding: 4px;
    display: flex;
    border-radius: 10px;
    gap: 4px;
}
.options-btn {
    position: relative;
    color: #fff;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.5s ease;
    .svg-icon {
        font-size: 32px;
    }
    .top-tips {
        opacity: 0;
        transition: opacity 0.5s ease;
        position: absolute;
        top: -40px;
        white-space: nowrap;
        padding: 4px 6px;
        background-color: #27282F;
        border-radius: 4px;
        font-size: 16px;
        line-height: 24px;
    }
}
.options-btn:hover {
    background-color: rgba(62, 65, 76, 0.4);
    cursor: pointer;
    .top-tips {
        opacity: 1;
    }
}
.option-selected {
    background-color: #3C7EFF !important;
}
.option-child-btn {
    min-width: 120px;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
    gap: 8px;
    padding: 0 4px;
    &:hover {
        background: rgba(62, 65, 76, 0.8);
    }
}
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
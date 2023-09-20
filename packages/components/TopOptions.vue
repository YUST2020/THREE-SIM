<template>
    <div class="options-outer" @click.stop>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'translate'}" @click="setMode('translate')">
            <svg-icon iconClass="rotate"></svg-icon>
            <div class="top-tips">旋转模式</div>
        </div>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'scale'}" @click="setMode('scale')">
            <svg-icon iconClass="scale"></svg-icon>
            <div class="top-tips">缩放模式</div>
        </div>
        <div class="options-btn">
            <svg-icon iconClass="mirror"></svg-icon>
            <div class="top-tips">镜像</div>
        </div>
        <div class="options-btn" @click="delObj">
            <svg-icon iconClass="bin"></svg-icon>
            <div class="top-tips">删除</div>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
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
        setMode(mode) {
            this.emitMethods.setMode(mode)
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
        padding: 4px 10px;
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
</style>
<template>
    <div class="options-outer" @click.stop>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'translate'}" @click="setMode('translate')">旋转</div>
        <div class="options-btn" :class="{'option-selected': this.state.mode === 'scale'}" @click="setMode('scale')">缩放</div>
        <div class="options-btn">镜像</div>
        <div class="options-btn">删除</div>
    </div>
</template>

<script>
export default {
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
        }
    }
}
</script>

<style scoped>
.options-outer {
    position: absolute;
    top: 50px;
    left: calc(50% - 122px);
    background-color: #3E414C;
    padding: 4px;
    display: flex;
    border-radius: 10px;
}
.options-btn {
    color: #fff;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}
.options-btn:hover {
    background-color: #2C2E36;
    cursor: pointer;
}
.option-selected {
    background-color: #3C7EFF !important;
}
</style>
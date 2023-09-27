<template>
    <div>
        <div class="options-outer top-add flex-center" @click="adding = !adding">
            <svg-icon v-if="!adding" icon-class="add"></svg-icon>
            <template v-else>
                <svg-icon icon-class="close"></svg-icon>
                <div class="tip-dialog" style="padding: 16px;">
                    <div v-for="(item, index) in addList" :key="index" class="add-row" @click="addObj(item)">
                        <img>
                        <div class="add-text">
                            <div>{{ item.title }}</div>
                            <div>{{ item.subTitle }}</div>
                        </div>
                    </div>
                </div>
            </template>

        </div>
        <div class="options-outer" @click.stop>
            <div v-for="item in options" :key="item.title" class="options-btn" draggable @click="setSelected(item)">
                {{ item.title }}
                <div class="tip-dialog" style="left: 72px;">
                    <div class="add-text">
                        <div>{{ item.title }}</div>
                        <div>{{ item.subTitle }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getBoundingSize } from '../utils/object'
export default {
    props: ['emitMethods'],
    data() {
        return {
            adding: false,
            curOption: '',
            options: [],
            addList: []
        }
    },
    mounted() {

    },
    methods: {
        setAddableList(list) {
            this.addList = list
        },
        setObjs(list) {
            console.log('objs::', list);
            this.options = list
        },
        addObj(item) {
            const newObj = new item.class({ x: 0, y:0, z: 0 })
            setTimeout(() => {
                newObj.position.z = getBoundingSize(newObj).z / 2
            },500)
            this.emitMethods.add(newObj)
            this.setSelected(newObj)
        },
        setSelected(obj) {
            this.emitMethods.setSelected(obj)
        }
    }
}
</script>

<style lang="less" scoped>
.options-outer {
    position: absolute;
    top: 20%;
    left: 50px;
    background-color: #1F2126;
    padding: 8px;
    border-radius: 10px;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: visible;
    box-sizing: border-box;
}
::-webkit-scrollbar {
    width: 0px;
}

.options-btn {
    color: #fff;
    background-color: #2E3138;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    position: relative;
    margin-bottom: 4px;
    .tip-dialog {
        display: none;
        opacity: 0;
        transition: opacity 0.5s ease;
    }
}

.options-btn:hover {
    background-color: #2C2E36;
    cursor: pointer;
    .tip-dialog {
        display: block;
        opacity: 1;
    }
}

.option-selected {
    background-color: #3C7EFF !important;
}

.top-add {
    top: calc(20% - 88px);
    width: 72px;
    height: 72px;
    border: 2px solid #3C7EFF;
    background-color: #15274A;
    cursor: pointer;

    .svg-icon {
        font-size: 24px;
    }
}

.tip-dialog {
    position: absolute;
    left: 84px;
    top: 0px;
    background-color: #1F2126;
    color: #fff;
    padding: 4px 10px;
    border-radius: 8px;

    .add-row {
        width: 187px;
        height: 72px;
        display: flex;
        padding: 8px 12px;
        border-radius: 4px;
        gap: 12px;
        box-sizing: border-box;
        transition: background-color 0.5s ease;
        cursor: pointer;

        &:hover {
            background-color: #383A44;
        }

        img {
            display: inline-block;
            width: 56px;
            height: 56px;
        }
    }

    .add-text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        div {
            text-align: left;
            white-space: nowrap;
        }

        div:nth-child(2) {
            font-weight: 400;
            opacity: 0.7;
        }
    }
}
</style>
<template>
    <div>
        <div class="options-outer" style="top: 15px;width:64px;height: 64px;">
            <span style="color: #fff;font-size: 30px;">+</span>
        </div>
        <div class="options-outer" @click.stop>
            <div v-for="item in options" :key="item.title" class="options-btn" draggable>图片</div>
        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            curOption: '',
            options: [
                {title: '机床1',subTitle: ''},
                {title: '机床2',subTitle: ''},
                {title: '双列料库',subTitle: ''},
                {title: '双列料库',subTitle: ''},
                {title: '取料车',subTitle: ''},
                {title: '入料车',subTitle: ''},
                {title: '',subTitle: ''},
                {title: '',subTitle: ''},
                {title: '',subTitle: ''},
            ]
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>

<style scoped>
.options-outer {
    position: absolute;
    top: 10%;
    left: 50px;
    background-color: #3E414C;
    padding: 8px;
    display: flex;
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-sizing: border-box;
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
}
.options-btn:hover {
    background-color: #2C2E36;
    cursor: pointer;
}
.option-selected {
    background-color: #3C7EFF !important;
}
</style>
<template>
    <div class="lyric-container">
       <p>ldjfalsdfjdlsfj;l</p>
    </div>
</template>


<script>
export default {
    data() {
        message: 123
    },
    mounted() {
        console.log(this.message)
    }
}
</script>

<style lang="scss" scope>
    .lyric-container{
        width: 100px;
        height: 100px;
        background: black;
        z-index: 1000;
        display: inline-block;
    }
</style>
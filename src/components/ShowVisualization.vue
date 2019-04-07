<template>
    <canvas ref="canvas" height="750" width="750"></canvas>
</template>

<style scoped>
</style>

<script>
    import {InitializeCanvasRenderer} from '../elf/CanvasRenderer'

    function render() {
        if (!this.data)
            return;
        this.canvasRenderer = InitializeCanvasRenderer(this.data, this.$refs.canvas, 0.4)
        this.canvasRenderer.renderCanvas();
    }

    export default {
        name: 'ShowVisualization',
        props: {
            data: null,
        },
        data() {
            return {
            }
        },
        watch: {
            data: render,
        },
        mounted: render,
    }
</script>

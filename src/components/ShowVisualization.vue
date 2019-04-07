<template>
    <canvas ref="canvas" height="750" width="500"></canvas>
</template>

<style scoped>
</style>

<script>
    import {InitializeCanvasRenderer} from '../elf/VisualizationUtils'

    function renderWithContext(){
        if (!this.data)
            return;
        this.canvasRenderer = InitializeCanvasRenderer(this.data, this.$refs.canvas, 0);
        this.canvasRenderer.renderCanvas();
    }

    function render(context){
        if (!context.data)
            return;
        context.canvasRenderer = InitializeCanvasRenderer(context.data, context.$refs.canvas, 0);
        context.canvasRenderer.renderCanvas();
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
            data: renderWithContext,
        },
        mounted(){
            render(this);
            this.$parent.$on('render', () => {
                render(this);
            });
        },
    }
</script>

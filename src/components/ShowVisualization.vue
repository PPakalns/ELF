<template>
    <canvas ref="canvas" height="1000" width="1000"></canvas>
</template>

<style scoped>
</style>

<script>
    import {InitializeCanvasRenderer} from '../elf/CanvasRenderer'

    export default {
        name: 'ShowVisualization',
        props: {
            data: null
        },
        /*watch: {
            'data': {
                handler(value) {
                    //TODO: add parsed data to canvas
                    //console.log("DATA FOR CANVAS IS: ",value);
                },
                immediate: true,
            }
        },*/
        mounted: function() {
            let data = {
                inMemory: {
                    totalMemory: 150,
                    memoryDistribution: [
                        {
                            name:"Test1",
                            size: 50,
                            offset: 0
                        },
                        {
                            name:"Test2",
                            size: 100,
                            offset: 100
                        },
                    ]
                },
                inFile: {
                    totalMemory: 200,
                    memoryDistribution: [
                        {
                            name:"Test1",
                            size: 100,
                            offset: 0
                        },
                        {
                            name:"Test2",
                            size: 100,
                            offset: 100
                        },
                    ]
                }
            };

            let canvasRenderer = InitializeCanvasRenderer(data, this.$refs.canvas, 0.2); //Must be set in watch.
            canvasRenderer.renderInMemoryCanvas();
        }
    }
</script>

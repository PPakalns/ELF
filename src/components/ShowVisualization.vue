<template>
    <canvas ref="canvas" height="1000" width="1000"></canvas>
</template>

<style scoped>
</style>

<script>
    import {RenderCanvas} from '../elf/CanvasRenderer'

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
            RenderCanvas(
                [
                    {name: "Header 1", size: 10},
                    {name: "Header 2", size: 10},
                    {name: "Header 3", size: 10},
                    {name: "Very Long Header 123456", size: 10},
                    {name: "Header 5", size: 10},
                    {name: "Header 6", size: 10},
                    {name: "Header 7", size: 10},
                ],
                this.$refs.canvas,
                0.2
            );
        }
    }
</script>

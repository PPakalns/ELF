<template>
    <div>
        <h4>Currently showing: in {{currentShowFile ? 'file':'memory'}} distribution</h4>
        <canvas ref="canvas" height="750" width="750"></canvas>
        <div>
            <button v-if="!currentShowFile" v-on:click="showFile">Show File</button>
            <button v-if="currentShowFile" v-on:click="showMemory">Show Memory</button>
        </div>
    </div>
</template>

<style scoped>
    button {
        padding: 1rem;

        color: white;
        background-color: #2EA169;

        border-radius: .3rem;

        text-align: center;
        font-weight: bold;
    }
</style>

<script>
    import {InitializeCanvasRenderer} from '../elf/CanvasRenderer'

    export default {
        name: 'ShowVisualization',
        props: {
            data: null,
        },
        data() {
            return {
                currentShowFile: null,
            }
        },
        methods:{
            showFile: function(){
                this.currentShowFile = true;
                this.canvasRenderer.renderInFileCanvas();
            },
            showMemory: function(){
                this.currentShowFile = false;
                this.canvasRenderer.renderInMemoryCanvas();
            }
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

            this.canvasRenderer = InitializeCanvasRenderer(data, this.$refs.canvas, 0.2); //Must be set in watch.
            this.showFile();
        }
    }
</script>

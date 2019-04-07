<template>
    <div>
        <div>
            <button v-on:click="handleFileLayoutChange">
                {{ fileLayout ? 'File layout' : 'Memory layout' }}
            </button>
            <button v-on:click="handleSectionChange">
                {{ sectionLayout ? 'Section layout' : 'Program segment layout' }}
            </button>
        </div>
        <div class="visualization">
            <ShowVisualization v-bind:data="currentData"/>
            <div>
                <div v-for="(value, index) in currentData.list" v-bind:key="index + 'legend'" v-on:click="handleLegendClick(index)" class="legend-element">
                    <span v-bind:style="{backgroundColor: value.color}" class="legend-color"></span>
                    <span v-bind:style=" value.focused ? 'font-weight: bold;' : 'font-weight: initial;' " > {{value.name}} {{value.size}} </span>
                </div>
                <label>
                    Zoom
                    <input type="number"
                           v-on:change="handleZoomChange"
                           v-model.lazy="currentData.zoom"
                           placeholder="Input zoom" />
                </label>
                <label>
                    Offset
                    <input type="number"
                           v-on:change="handleOffsetChange"
                           v-model.lazy="currentData.offset"
                           placeholder="Input offset" />
                </label>
                <button v-on:click="handleResetLegend">
                    Reset Legend
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .visualization{
        display: flex;
    }

    .legend-element{
        display: flex;
        cursor: pointer;
    }

    .legend-color{
        width: 18px;
        background-color: blue;
        margin: 0 10px;
    }

    button {
        padding: 1rem;

        color: white;
        background-color: #2EA169;

        border-radius: .3rem;

        text-align: center;
        font-weight: bold;
        margin: 5px;
    }
</style>

<script>
    import ShowVisualization from './ShowVisualization.vue';
    import {InitializeColorAdder} from '../elf/VisualizationUtils';

    function getLayout(layout, inFile)
    {
        let output = [];
        for (let l of layout) {
            output.push({
                name: l.name,
                offset: inFile ? l.offset : l.address,
                size: inFile ? l.fileSize : l.memorySize,
                focused: false
            })
        }

        let sortedAscending = Array.from(output).sort((a, b) => a.offset - b.offset);
        let colorAdder = InitializeColorAdder(sortedAscending);
        let colorizedList =  colorAdder.getColorizedList();

        let lastElement = colorizedList[colorizedList.length - 1];
        let maxSize = lastElement.offset + lastElement.size;

        return {
            size: maxSize,
            list: colorizedList,
            zoom: 1,
            offset: 0
        };
    }

    function getSectionLayout(sectionData, fileLayout)
    {
        // See https://docs.oracle.com/cd/E19683-01/817-3677/6mj8mbtc9/index.html#chapter6-73445
        const SHT_NOBITS = 0x8;

        let data = [];
        for (let section of sectionData)
        {
            let header = section.header;
            // Not in memory layout
            if (!fileLayout && header.getLongData('sh_addr') == 0)
                continue;

            let fileSize = header.getLongData('sh_size')
            if (fileLayout && header.getLongData('sh_type') == SHT_NOBITS)
            {
                // Doesn't take up space in file
                fileSize = 0
            }

            data.push({
                name: section.name,
                offset: header.getLongData('sh_offset'),
                address: header.getLongData('sh_addr'),
                fileSize: fileSize,
                memorySize: header.getLongData('sh_size'),
            })
        }
        return getLayout(data, fileLayout)
    }

    function getSegmentLayout(segmentData, fileLayout)
    {
        // See https://docs.oracle.com/cd/E19683-01/816-1386/chapter6-83432/index.html
        const PT_LOAD = 0x1;

        let data = [];
        for (let segment of segmentData)
        {
            let header = segment.header
            if (header.getLongData('p_type') != PT_LOAD)
                continue;

            data.push({
                name: segment.name + '_' + data.length,
                offset: header.getLongData('p_offset'),
                address: header.getLongData('p_vaddr'),
                fileSize: header.getLongData('p_filesz'),
                memorySize: header.getLongData('p_memsz'),
            });
        }
        return getLayout(data, fileLayout);
    }

    function resetLegend(context){
        context.focusedIndex = null;
        context.currentData.zoom = 1;
        context.currentData.offset = 0;
        context.$emit('render');
    }

    export default {
        name: 'ShowElfLayout',
        components: {
            ShowVisualization,
        },
        props: {
            data: null,
        },
        methods: {
            handleLegendClick(elementIndex){
                if(elementIndex === this.focusedIndex) return;

                this.currentData.list[elementIndex].focused = true;
                if(this.focusedIndex != null){
                    this.currentData.list[this.focusedIndex].focused = false;
                }
                this.focusedIndex = elementIndex;

                let focusedElement = this.currentData.list[elementIndex];
                let whenShouldScrollRatio = 0.1;
                let smallestSize = this.currentData.size * whenShouldScrollRatio;

                if(focusedElement.size < smallestSize){
                    if(focusedElement.size !== 0){
                        this.currentData.zoom = Math.round(smallestSize/focusedElement.size);
                    }
                    this.currentData.offset = focusedElement.offset - (focusedElement.size/whenShouldScrollRatio)/2;
                }
                else{
                    this.currentData.zoom = 1;
                    this.currentData.offset = 0;
                }

                this.$forceUpdate();
                this.$emit('render');
            },
            handleSectionChange(){
                this.sectionLayout = !this.sectionLayout;
                resetLegend(this);
            },
            handleFileLayoutChange(){
                this.fileLayout = !this.fileLayout;
                resetLegend(this);
            },
            handleResetLegend(){
                if(this.focusedIndex != null){
                    this.currentData.list[this.focusedIndex].focused = false;
                }

                resetLegend(this);
                this.$forceUpdate();
            },
            handleZoomChange(){
                this.$emit('render');
            },
            handleOffsetChange(){
                this.$emit('render');
            }
        },
        data() {
            return {
                fileLayout: true,
                sectionLayout: true,
                focusedIndex: null
            }
        },
        computed: {
            currentData() {
                if (!this.data)
                    return;
                let data;
                if (this.sectionLayout)
                    data = getSectionLayout(this.data.sections, this.fileLayout)
                else
                    data = getSegmentLayout(this.data.segments, this.fileLayout)
                return data;
            }
        },
    }
</script>

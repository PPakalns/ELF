<template>
    <div v-if="data" class="container">
        <div class="right-column">
            <ShowElfLayout v-bind:data="data"/>
        </div>
        <div class="left-column">
            <h2>Elf Header</h2>
            <div>
                <ShowList v-bind:list="elf_header">
                </ShowList>
            </div>
            <span>File size: {{ data.length }} bytes</span>
            <h2>Program Header Table</h2>
            <div>
                <ShowList v-for="(segment, idx) in program_headers"
                          :collapsible=true
                          :start_collapsed=true
                          v-bind:title="segment.name"
                          v-bind:list="segment.list"
                          v-bind:key="idx">
                </ShowList>
            </div>
            <h2>Section Header Table</h2>
            <div>
                <ShowList v-for="(section, idx) in section_headers"
                          :collapsible=true
                          :start_collapsed=true
                          v-bind:title="section.name"
                          v-bind:list="section.list"
                          v-bind:key="idx">
                </ShowList>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: center;
}

.left-column {
    flex: 0 0.1 500px;
    margin-right: 20px;
}

.right-column {
    flex: 0 1 750px;
}
</style>

<script>

import { ParseElf } from '../elf/elf.js'
import ShowList from './ShowList.vue'
import ShowElfLayout from './ShowElfLayout.vue'

function GetListContentRepresentation(list)
{
    let listOfRepresentations = []
    for (let item of list)
    {
        listOfRepresentations.push({name: item.name , list: item.header.getRepresentation()})
    }
    return listOfRepresentations
}


export default {
    name: 'ElfFileVisualiser',
    components: {
        ShowList,
        ShowElfLayout
    },
    props: {
        elf: null,
    },
    data() {
        return {
            data: null,
        }
    },
    watch: {
        'elf': {
            handler(value) {
                if (!value)
                    return;
                let reader = new FileReader()
                reader.onload = e => {
                    this.data = ParseElf(e.target.result)
                }
                reader.readAsArrayBuffer(value)
            },
            immediate: true,
        }
    },
    computed: {
        elf_header() {
            if (!this.data)
                return;
            return this.data.elf_header.getRepresentation()
        },
        section_headers() {
            if (!this.data)
                return;
            return GetListContentRepresentation(this.data.sections)
        },
        program_headers() {
            if (!this.data)
                return;
            return GetListContentRepresentation(this.data.segments)
        },
    },
}
</script>

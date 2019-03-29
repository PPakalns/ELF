<template>
    <div v-if="data">
        <div>
            <span>File size: {{ data.length }} bytes</span>
            <ShowList title="ELF header" v-bind:list="elf_header">
            </ShowList>
        </div>
        <h4>Program Header Table</h4>
        <div>
            <ShowList v-for="(segment, idx) in program_headers"
                      title=""
                      v-bind:list="segment"
                      v-bind:key="idx">
            </ShowList>
        </div>
        <h4>Section Header Table</h4>
        <div>
            <ShowList v-for="(section, idx) in section_headers"
                      v-bind:title="section.name"
                      v-bind:list="section.list"
                      v-bind:key="idx">
            </ShowList>
        </div>
    </div>
</template>


<style scoped>

</style>

<script>

import { ParseElf } from '../elf/elf.js'
import ShowList from './ShowList.vue'

function GetListContentRepresentation(list)
{
    let listOfRepresentations = []
    for (let item of list)
    {
        listOfRepresentations.push(item.getRepresentation())
    }
    return listOfRepresentations
}

function GetSectionRepresentationsWithNames(section_headers)
{
    let listOfRepresentations = []
    for (let item of section_headers)
    {
        listOfRepresentations.push({name: item.name ,list: item.header.getRepresentation()})
    }
    return listOfRepresentations
}

export default {
    name: 'ElfFileVisualiser',
    components: {
        ShowList,
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
            return GetSectionRepresentationsWithNames(this.data.sections)
        },
        program_headers() {
            if (!this.data)
                return;
            return GetListContentRepresentation(this.data.segments)
        },
    },
}
</script>

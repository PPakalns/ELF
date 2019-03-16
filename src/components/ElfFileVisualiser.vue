<template>
    <div>
        <span v-if="data">File size: {{ data.length }} bytes</span>
        <ShowList v-if="data" title="ELF header" v-bind:list="elf_header">
        </ShowList>
    </div>
</template>


<style scoped>

</style>

<script>

import { ParseElf } from '../elf/elf.js'
import ShowList from './ShowList.vue'

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
    },
}
</script>

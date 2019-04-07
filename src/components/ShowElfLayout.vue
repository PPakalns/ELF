<template>
    <div>
        <div>
            <button v-on:click="fileLayout = !fileLayout">
                {{ fileLayout ? 'File layout' : 'Memory layout' }}
            </button>
            <button v-on:click="sectionLayout = !sectionLayout">
                {{ sectionLayout ? 'Section layout' : 'Program segment layout' }}
            </button>
        </div>
        <ShowVisualization v-bind:data="currentData"/>
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
        margin: 5px;
    }
</style>

<script>
    import ShowVisualization from './ShowVisualization.vue'

    function getLayout(layout, inFile)
    {
        let output = []
        for (let l of layout)
        {
            output.push({
                name: l.name,
                offset: inFile ? l.offset : l.address,
                size: inFile ? l.fileSize : l.memorySize,
            })
        }
        return output
    }

    function getSectionLayout(sectionData, fileLayout)
    {
        // See https://docs.oracle.com/cd/E19683-01/817-3677/6mj8mbtc9/index.html#chapter6-73445
        const SHT_NOBITS = 0x8

        let data = []
        for (let section of sectionData)
        {
            let header = section.header
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
        const PT_LOAD = 0x1

        let data = []
        for (let segment of segmentData)
        {
            let header = segment.header
            if (header.getLongData('p_type') != PT_LOAD)
                continue

            data.push({
                name: segment.name + '_' + data.length,
                offset: header.getLongData('p_offset'),
                address: header.getLongData('p_vaddr'),
                fileSize: header.getLongData('p_filesz'),
                memorySize: header.getLongData('p_memsz'),
            })
        }
        return getLayout(data, fileLayout)
    }

    export default {
        name: 'ShowElfLayout',
        components: {
            ShowVisualization,
        },
        props: {
            data: null,
        },
        data() {
            return {
                fileLayout: true,
                sectionLayout: true,
            }
        },
        computed: {
            currentData() {
                if (!this.data)
                    return;
                let data
                if (this.sectionLayout)
                    data = getSectionLayout(this.data.sections, this.fileLayout)
                else
                    data = getSegmentLayout(this.data.segments, this.fileLayout)
                return data
            }
        },
    }
</script>

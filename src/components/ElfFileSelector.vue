<template>
    <div>
        <h3>Please select an ELF file</h3>
        <FileSelector v-model="tmpval"></FileSelector>
    </div>
</template>


<script>
import FileSelector from './FileSelector.vue'

export default {
    name: 'ElfFileSelector',
    components: {
        FileSelector,
    },
    props: {
        value: null,
    },
    data() {
        return {
            tmpval: null,
        }
    },
    watch: {
        tmpval(val) {
            this.$emit('input', val)
        }
    },
}
</script>

<style scoped>

</style>

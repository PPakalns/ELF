<template>
    <div>
        <h4 v-if="title">{{ title }}</h4>
        <dl>
            <template v-for="(value, index) in list">
                <dt v-bind:key="index + '-dt'">{{ value.name }}</dt>
                <dd v-bind:key="index + '-dd'">
                    <ShowList v-if="value.value instanceof Array"
                                 v-bind:list="value.value">
                    </ShowList>
                    <template v-else>{{ value.value }}</template>
                </dd>
            </template>
        </dl>
    </div>
</template>


<style scoped>
dl {
    display: flex;
    flex-flow: row wrap;
    border: solid #333;
    border-width: 1px 1px 0 0;
    font-family: monospace;
}
dt {
    flex-basis: 20%;
    padding: 2px 4px;
    background: #333;
    text-align: right;
    color: #fff;
}
dd {
    text-align: right;
    flex-basis: 70%;
    flex-grow: 1;
    margin: 0;
    padding: 2px 8px;
    border-bottom: 1px solid #333;
}
</style>

<script>
export default {
    name: 'ShowList',
    props: {
        title: null,
        list: null,
    },
}
</script>

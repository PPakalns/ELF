<template>
    <div>
        <h4>{{ title }}</h4>
        <dl id="v-for-list" class="demo">
            <template v-for="(value, index) in list">
                <template v-if="value.value instanceof Array ">
                    <dt v-bind:key="index + 'dt'">{{ value.name }}</dt>
                    <dd v-bind:key="index + 'dd'" class = "inner-table">
                        <dl>
                            <template v-for="(innerValue, innerIndex) in value.value">
                                <dt v-bind:key="innerIndex + 'dt-inner'">{{ innerValue.name }}</dt>
                                <dd v-bind:key="innerIndex + 'dd-inner'">{{ innerValue.value }}</dd>
                            </template>
                        </dl>
                    </dd>
                </template>
                <template v-else>
                    <dt v-bind:key="index + 'dt'">{{ value.name }}</dt>
                    <dd v-bind:key="index + 'dd'">{{ value.value }}</dd>
                </template>
            </template>
        </dl>
    </div>
</template>


<style>
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
    padding: 2px;
    padding-left: 0px;
    padding-right: 8px;
    border-bottom: 1px solid #333;
}
.inner-table {
    padding: 0px;
    border-bottom: 0px;
}
.inner-table dl{
    margin-block-start: 0;
    margin-block-end: 0;
    border-width: 0;
}

.inner-table dl dt{
    flex-basis: 15%;
    background: white;
    color: black;
    border-bottom: 1px solid #333;
}
.inner-table dl dd{
    flex-basis: 75%;
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

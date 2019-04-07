<template>
    <div class="container">
        <div v-if="title"
             class="title"
             v-on:click="collapsed = !collapsed"
             v-bind:class="{ 'clickable_title': collapsable }">
            {{ title }}
        </div>
        <dl v-if="!collapsed || !collapsable">
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
.container {
    border: 1px solid #333;
    padding: 0px;
}

.title {
    font-weight: bold;
}

.clickable_title {
    cursor:pointer;
}

dl {
    display: flex;
    flex-flow: row wrap;
    font-family: monospace;
    margin: 0px;
    margin-top: -1px;
}
dt {
    flex-basis: 30%;
    padding: 2px 4px;
    background: #333;
    text-align: right;
    color: #fff;
}
dd {
    text-align: right;
    flex-basis: 60%;
    flex-grow: 1;
    margin: 0;
    padding: 2px 8px;
    border-top: 1px solid #333;
}
</style>

<script>
export default {
    name: 'ShowList',
    props: {
        title: null,
        list: null,
        collapsable: {
            type: Boolean,
            default: false,
        },
        start_collapsed: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            collapsed: this.start_collapsed,
        }
    }
}
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { getOUTree } from '#/api/system/ou';

const selectFieldNames = {
  label: 'text',
  value: 'id',
  children: 'nodes',
};
const fieldNames = {
  title: 'text',
  key: 'id',
  children: 'nodes',
};
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const treeData = ref([{ text: 'Orginization Unit', id: '', nodes: [] }]);

onMounted(() => {
  return getOUTree('')
    .then((res) => {
      console.log('res', res);
      treeData.value = res;
    })
    .catch((error) => {
      console.log('err', error);
    });
});
const canSave = computed(() => {
  return true;
});
const selectNode = ref({
  id: 0,
});
const onSelect = (treeNode: any, e: any) => {
  // console.log('selected node', e);
  selectNode.value = e.node.dataRef;
  console.log('selected node', selectNode.value);
};
</script>
<template>
  <a-row :gutter="16" style="height: 400px; margin-bottom: 5px">
    <a-col :span="4">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :field-names="fieldNames"
        :tree-data="treeData"
        auto-expand-parent
        default-expand-all
        style="height: 400px; margin-bottom: 5px"
        @select="onSelect"
      />
    </a-col>

    <a-col :span="16">
      <a-page-header
        style="border: 1px solid rgb(235 237 240)"
        sub-title="Organization list page"
        title="Organizations"
      />

      <a-button type="primary">New</a-button>
      <a-button :disabled="canSave" type="primary"> Save </a-button>
      <a-divider type="horizontal" />

      <a-form>
        <a-form-item label="ID">
          <a-label>{{ selectedKeys[0] }}</a-label>
        </a-form-item>
        <a-form-item label="Parent">
          <a-tree-select
            v-model:value="selectNode.parentId"
            :field-names="selectFieldNames"
            :tree-data="treeData"
            placeholder="Please select an parent"
            tree-default-expand-all
          />
        </a-form-item>
        <a-form-item label="Name">
          <a-input
            v-model:value="selectNode.name"
            placeholder="Please enter name"
          />
        </a-form-item>
        <a-form-item label="Displayname">
          <a-input
            v-model:value="selectNode.text"
            placeholder="Please enter Displayname"
          />
        </a-form-item>
        <a-form-item label="Sort Order">
          <a-input
            v-model:value="selectNode.sortorder"
            placeholder="Please enter soft order"
            type="number"
          />
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

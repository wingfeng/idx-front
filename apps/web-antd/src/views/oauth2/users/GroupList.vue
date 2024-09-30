<script lang="ts" setup>
import type { TreeSelectProps } from 'ant-design-vue';

import { onMounted, ref, watch } from 'vue';

const treeData = ref<TreeSelectProps['treeData']>();
onMounted(() => {
  treeData.value = [
    {
      label: 'root 1',
      value: 'root 1',
      children: [
        {
          label: 'parent 1',
          value: 'parent 1',
          children: [
            {
              label: 'parent 1-0',
              value: 'parent 1-0',
              children: [
                {
                  label: 'my leaf',
                  value: 'leaf1',
                },
                {
                  label: 'your leaf',
                  value: 'leaf2',
                },
              ],
            },
            {
              label: 'parent 1-1',
              value: 'parent 1-1',
            },
          ],
        },
        {
          label: 'parent 2',
          value: 'parent 2',
        },
      ],
    },
  ];
});
const p = ref<string>();
watch(p, () => {
  console.log(p.value);
});
</script>
<template>
  <a-tree-select
    v-model:value="p"
    :tree-data="treeData"
    label-in-value
    placeholder="Please select"
  />
</template>

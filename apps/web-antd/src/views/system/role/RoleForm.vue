<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';

import type { RoleInfo } from '#/types/role';

import { computed, ref } from 'vue';

const props = defineProps<{
  formModel: RoleInfo;
}>();
const model = computed(() => {
  return props.formModel;
});
const form = ref();

const validate = () => {
  return form.value
    .validate()
    .then(() => {
      return true;
    })
    .catch((error: any) => {
      console.log('error submit:', error);
      return false;
    });
};
const resetForm = () => {
  form.value.resetFields();
};

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: 'Please input name',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
  description: [
    {
      required: true,
      message: 'Please input description',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
};
defineExpose({ validate, resetForm, model });
</script>
<template>
  <a-form
    ref="form"
    :label-col="labelCol"
    :model="model"
    :rules="rules"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="Id">
      <a-label>{{ model.id }}</a-label>
    </a-form-item>

    <a-form-item label="Name" name="name" required>
      <a-input v-model:value="model.name" />
    </a-form-item>

    <a-form-item label="Description" name="description" required>
      <a-textarea v-model:value="model.description" />
    </a-form-item>
  </a-form>
</template>

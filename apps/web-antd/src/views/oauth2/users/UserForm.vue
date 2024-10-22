<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';

import type { UserInfo } from '#/types/user';

import { computed, ref } from 'vue';

import {} from 'ant-design-vue';

const props = defineProps<{
  formModel: UserInfo;
  orgTreeData: any;
}>();
const model = computed(() => {
  return props.formModel;
});
const fieldNames = {
  label: 'text',
  value: 'id',
  children: 'nodes',
};
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
  account: [
    {
      required: true,
      message: 'Please input account',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
  displayname: [
    {
      required: true,
      message: 'Please input DisplayName',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: 'Please input email',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
};
const orgInfo = computed({
  get() {
    return {
      label: model.value.ou,
      value: model.value.ouid,
    };
  },
  set(v) {
    console.log(v);
    model.value.ou = v.label;
    model.value.ouid = v.value;
  },
});
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
      <label>{{ model.Id }}</label>
    </a-form-item>

    <a-form-item label="Account" name="account" required>
      <a-input v-model:value="model.Account" />
    </a-form-item>
    <a-form-item label="Organization" name="ou">
      <a-tree-select
        v-model:value="orgInfo"
        :field-names="fieldNames"
        :tree-data="props.orgTreeData"
        label-in-value
        placeholder="Please select an oganization"
      />
    </a-form-item>
    <a-form-item label="Email" name="email" required>
      <a-input v-model:value="model.Email" />
    </a-form-item>
    <a-form-item label="DisplayName" name="displayname" required>
      <a-input v-model:value="model.DisplayName" />
    </a-form-item>
    <a-form-item label="Phone Number" name="PhoneNumber">
      <a-input v-model:value="model.PhoneNumber" type="number" />
    </a-form-item>
    <a-form-item label="Locked" name="Locked">
      <a-switch v-model:checked="model.LockoutEnabled" />
    </a-form-item>
    <a-form-item label="Temporary Password" name="Temporary">
      <a-switch v-model:checked="model.IsTemporaryPassword" />
    </a-form-item>
  </a-form>
</template>

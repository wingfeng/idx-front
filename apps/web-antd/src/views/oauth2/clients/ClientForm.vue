<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';

import type { ClientInfo } from '#/types/client';

import { computed, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';

import { cloneDeep } from 'lodash-es';

import { OAuth2GrantTypes } from '#/config/grandtypes';

import Secret from './Secret.vue';

const props = defineProps<{
  client: ClientInfo;
}>();
const model = computed(() => {
  return props.client;
});
const activeKey = ref('1');

const form = ref();
const scopeOptions = [
  { label: 'openid', value: 'openid' },
  { label: 'profile', value: 'profile' },
  { label: 'email', value: 'email' },
  { label: 'address', value: 'address' },
  { label: 'phone', value: 'phone' },
];
const scopes = computed({
  get() {
    return model.value.Scopes.split(' ');
  },
  set(newVal) {
    model.value.Scopes = newVal.join(' ');
  },
});

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
const grantTypesOptions = computed(() => {
  const types = [];
  OAuth2GrantTypes.forEach((key, v) => {
    types.push({ label: key, value: v });
  });

  return types;
});
const grantTypes = computed({
  get() {
    return model.value.GrantTypes.split(' ');
  },
  set(newVal) {
    model.value.GrantTypes = newVal.join(' ');
  },
});
const redirectUris = computed({
  get() {
    const array = model.value.RedirectUris
      ? model.value.RedirectUris.split(' ')
      : [];
    return array.join('\n');
  },
  set(newVal) {
    const array = newVal.split('\n');
    model.value.RedirectUris = array.join(' ');
  },
});
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
const rules: Record<string, Rule[]> = {
  ClientName: [
    {
      required: true,
      message: 'Please input Client name',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
  ClientId: [
    {
      required: true,
      message: 'Please input Client Id',
      trigger: 'change',
    },
    { min: 3, max: 25, message: 'Length should be 3 to 25', trigger: 'blur' },
  ],
  Scopes: [
    {
      required: true,
      message: 'Scopes cannot be empty',
      trigger: 'change',
    },
  ],

  GrantTypes: [
    {
      required: true,
      message: 'GrantTypes cannot be empty',
      trigger: 'change',
    },
  ],
};
defineExpose({ validate, resetForm, model });
// Claims
const claims = computed(() => {
  if (model.value.Claims === undefined || model.value.Claims === null) {
    return [];
  }
  const obj = model.value.Claims;
  const tmpArray = Object.entries(obj);
  const result: any[] = [];
  let i = 1;
  tmpArray.forEach((item) => {
    result.push({
      id: i,
      Name: item[0],
      Value: item[1],
    });
    i++;
  });
  return result;
});
const newClaims = () => {
  console.log('newClaims', model.value);
  if (model.value.Claims === undefined || model.value.Claims === null) {
    model.value.Claims = {};
  }
  model.value.Claims.NewClaims = 'Value';
};
const editableData: UnwrapRef<Record<string, any>> = reactive({});
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'Name',
  },
  {
    title: 'Value',
    dataIndex: 'Value',
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
  },
];
const edit = (key: string) => {
  editableData[key] = cloneDeep(claims.value.find((item) => key === item.id));
};
const save = (key: number) => {
  console.log('save', editableData[key]);
  const originName = claims.value.find((item) => item.id === key).Name;
  const item = editableData[key];
  if (originName !== item.Name) {
    delete model.value.Claims[originName];
  }

  model.value.Claims[item.Name] = item.Value;
  delete editableData[key];
};
const remove = (key: string) => {
  delete model.value.Claims[claims.value.find((item) => key === item.id).Name];
};
const cancel = (key: string) => {
  delete editableData[key];
};
</script>
<template>
  <a-tabs>
    <a-tab-pane key="1" v-model:activeKey="activeKey" tab="Base Info">
      <a-form
        ref="form"
        :label-col="labelCol"
        :model="model"
        :rules="rules"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="Id">
          <label>{{ model.id }}</label>
        </a-form-item>
        <a-form-item label="Enabled">
          <a-checkbox v-model:checked="model.Enabled" />
        </a-form-item>

        <a-form-item label="Client name" name="ClientName" required>
          <a-input v-model:value="model.ClientName" />
        </a-form-item>
        <a-form-item label="Client Id" name="ClientId" required>
          <a-input v-model:value="model.ClientId" />
        </a-form-item>
        <a-form-item label=" ">
          <a-checkbox v-model:checked="model.RequireConsent">
            Require consent
          </a-checkbox>
          <a-checkbox v-model:checked="model.RequireSecret">
            Require Secret
          </a-checkbox>
          <a-checkbox v-model:checked="model.RequirePkce">
            Require PKCE
          </a-checkbox>
        </a-form-item>
        <a-form-item label="Client Url">
          <a-input v-model:value="model.ClientURI" />
        </a-form-item>
        <a-form-item label="Client Logo Url">
          <a-image :src="client.LogoURI" height="32px" width="32px" />
          <a-input v-model:value="model.LogoURI" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="model.Description" />
        </a-form-item>
        <a-form-item label="Grant types" name="GrantTypes">
          <a-select
            v-model:value="grantTypes"
            :options="grantTypesOptions"
            mode="multiple"
          />
        </a-form-item>
        <a-form-item label="Scopes" name="Scopes">
          <a-select
            v-model:value="scopes"
            :options="scopeOptions"
            mode="multiple"
          />
        </a-form-item>
        <a-form-item label="Redirect Uris">
          <a-textarea v-model:value="redirectUris" />
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Claims">
      <a-button type="primary" @click="newClaims">Add</a-button>
      <a-table :columns="columns" :data-source="claims">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.id]">
                <a-button type="link" @click="save(record.id)">Save</a-button>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="Sure to cancel?"
                  @confirm="cancel(record.id)"
                >
                  <a-button type="link">Cancel</a-button>
                </a-popconfirm>
              </span>
              <span v-else>
                <a-button type="link" @click="edit(record.id)"> Edit </a-button>
                <a-divider type="vertical" />
                <a-button type="link" @click="remove(record.id)">
                  Remove
                </a-button>
              </span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'Name'">
            <div>
              <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-if="column.dataIndex === 'Value'">
            <div>
              <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="secrets" tab="Secrets">
      <Secret :client-id="model.id" />
    </a-tab-pane>
  </a-tabs>
</template>

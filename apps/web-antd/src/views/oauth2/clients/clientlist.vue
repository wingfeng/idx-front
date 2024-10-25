<script lang="ts" setup>
import type { ClientInfo } from '#/types/client';
import type { SortOrder } from '#/types/page';

import { computed, h, ref } from 'vue';
import { usePagination } from 'vue-request';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Divider } from 'ant-design-vue';

import { DeleteClient, GetClientsPage, SaveClient } from '#/store/client';

import ClientForm from './ClientForm.vue';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    key: 'enabled',
    sorter: true,
  },
  {
    title: 'ClientName',
    dataIndex: 'clientName',
    key: 'clientName',
    name: 'client_name',
    sorter: true,
    filtered: true,
  },
  {
    title: 'ClientId',
    dataIndex: 'clientId',
    key: 'client_id',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Scopes',
    dataIndex: 'scopes',
    key: 'scopes',
    sorter: true,
    filtered: true,
  },
  {
    title: 'GrantTypes',
    dataIndex: 'grantTypes',
    key: 'grantTypes',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Actions',
    key: 'action',
  },
];
const searchForm = ref();

const searchModel = ref({
  ClientId: '',
  ClientName: '',
});
const sortField = ref('id');
const sortOrder = ref('asc');
const filters = computed(() => {
  const tmp: Array<string> = [];
  if (searchModel.value.ClientId !== '') {
    tmp.push(`client_Id like ?`);
  }
  if (searchModel.value.ClientName !== '') {
    tmp.push(`client_Name like ?`);
  }
  return tmp;
});
const args = computed<Array<string>>(() => {
  const tmp: Array<string> = [];
  if (searchModel.value.ClientId !== '') {
    tmp.push(`%${searchModel.value.ClientId}%`);
  }
  if (searchModel.value.ClientName !== '') {
    tmp.push(`%${searchModel.value.ClientName}%`);
  }
  return tmp;
});
const {
  data: dataSource,
  run,
  refresh,
  loading,
  total,
  current,
  pageSize,
} = usePagination(GetClientsPage, {
  defaultParams: [
    {
      page: 1,
      pageSize: 10,
      sortField: 'id',
      sortOrder: 'asc' as SortOrder,
      filters: filters.value,
      args: args.value,
    },
  ],
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'pageSize',
  },
});
const fieldMap = new Map<String, string>([
  ['clientId', 'client_id'],
  ['clientName', 'client_name'],
  ['grantTypes', 'grant_types'],
  ['id', 'id'],
]);

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}));

const reloadTable = () => {
  setTimeout(() => {
    refresh();
  }, 50);
};
const handleSearch = () => {
  console.log('searchModel', searchModel.value);
  setTimeout(() => {
    run({
      page: current.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value as SortOrder,
      filters: filters.value,
      args: args.value,
    });
  }, 500);
};
const handleReset = () => {
  searchModel.value = {
    ClientId: '',
    ClientName: '',
  };
  searchForm.value.resetFields();
  reloadTable();
};
const open = ref<boolean>(false);
const row = ref<ClientInfo>({
  id: 0,
  enabled: true,
  clientId: '',
  clientName: '',
  grantTypes: 'authorization_code',
  scopes: 'openid',
  requireConsent: true,
  requirePkce: false,
  requireSecret: true,
  allowPlainTextPkce: false,
  allowOfflineAccess: false,
  alwaysIncludeUserClaimsInIdToken: false,
  allowRememberConsent: true,
  redirectUris: 'http://localhost:8080/signin-oidc',
});
const clientForm = ref();
const handleEdit = (record: ClientInfo) => {
  row.value = record;

  open.value = true;
};
const handleDelete = (id: string) => {
  DeleteClient(id);

  reloadTable();
};

const handleOk = async () => {
  try {
    const v = await clientForm.value.validate();
    if (!v) {
      return;
    }
    console.log('form validate', v);
  } catch (error) {
    console.log('error submit:', error);
    return;
  }
  SaveClient(row.value);
  open.value = false;
  reloadTable();
};
const handleCancel = () => {
  clientForm.value.resetForm();
  open.value = false;
};
const handleNew = () => {
  row.value = {
    id: 0,
    enabled: true,
    clientId: '',
    clientName: '',
    grantTypes: 'authorization_code',
    scopes: 'openid',
    requireConsent: true,
    requirePkce: false,
    requireSecret: true,
    allowPlainTextPkce: false,
    allowOfflineAccess: false,
    alwaysIncludeUserClaimsInIdToken: false,
    allowRememberConsent: true,
    redirectUris: 'http://localhost:8080/signin-oidc',
  };
  open.value = true;
};
const onTableChange = (pagination: any, filters: any, sorters: any) => {
  current.value = pagination.current;
  pageSize.value = pagination.pageSize;
  if (sorters.field) {
    sortField.value = fieldMap.get(sorters.field) ?? sorters.field; // 由于数据库字段和Json显示字段不一致，所以做了Mapping
    sortOrder.value = sorters.order;
  } else {
    sortField.value = 'Id';
    sortOrder.value = 'asc';
  }
  console.log('filter', filters);

  run({
    page: current.value,
    pageSize: pageSize.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value as SortOrder,
    filters: filters.value,
    args: args.value,
  });
};
</script>
<template>
  <div style="overflow-y: scroll">
    <a-page-header sub-title="Client list page" title="Clients" />
    <a-form ref="searchForm" :model="searchModel" layout="inline">
      <a-form-item label="ClientId">
        <a-input v-model:value="searchModel.ClientId" placeholder="ClientId" />
      </a-form-item>
      <a-form-item label="ClientName">
        <a-input
          v-model:value="searchModel.ClientName"
          placeholder="ClientName"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button
          :icon="h(RollbackOutlined)"
          type="primary"
          @click="handleReset"
        >
          Reset
        </a-button>
        <Divider type="vertical" />
        <a-button :icon="h(MoreOutlined)" type="primary" @click="handleNew">
          New
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider type="horizontal" />
    <a-table
      :columns="columns"
      :data-source="dataSource ? dataSource.list : null"
      :loading="loading"
      :pagination="pagination"
      :run="run"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              :icon="h(EditOutlined)"
              type="primary"
              @click="handleEdit(record)"
            >
              Edit
            </a-button>
            <Divider type="vertical" />
            <a-popconfirm
              title="Delete Client  "
              @confirm="handleDelete(record.id)"
            >
              <a-button :icon="h(DeleteOutlined)" danger>Delete</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-else-if="column.key === 'enabled'">
          <a-switch
            v-model:checked="record.enabled"
            enabled="false"
            size="small"
          />
        </template>
        <template v-else-if="column.key === 'scopes'">
          <a-space size="small" wrap>
            <a-tag
              v-for="sc in record.scopes.split(' ')"
              :key="sc"
              color="blue"
            >
              {{ sc }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'grantTypes'">
          <a-space size="small" wrap>
            <a-tag
              v-for="gt in record.grantTypes.split(' ')"
              :key="gt"
              color="geekblue"
            >
              {{
                gt === 'urn:ietf:params:oauth:grant-type:device_code'
                  ? 'device code'
                  : gt
              }}
            </a-tag>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="open"
      title="Edit Client Info"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <ClientForm ref="clientForm" :client="row" />
    </a-modal>
  </div>
</template>

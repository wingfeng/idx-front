<script lang="ts" setup>
import type { SortOrder } from '#/types/page';
import type { UserInfo } from '#/types/user';

import { computed, h, ref } from 'vue';
import { usePagination } from 'vue-request';

import {
  DeleteOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';

import { getRoleMembers } from '#/api/system/role';

const props = defineProps<{
  roleId: string;
}>();
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'Id',
    sorter: true,
    defaultSortOrder: 'ascend',
  },

  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    name: 'account',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Displayname',
    dataIndex: 'displayName',
    key: 'displayName',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Orgnization Unit',
    dataIndex: 'ou',
    key: 'ou',
    sorter: true,
  },
  {
    title: 'Lock Out',
    dataIndex: 'lockoutEnabled',
    key: 'lockoutEnabled',
    sorter: true,
  },
  {
    title: 'Temporary Password',
    dataIndex: 'isTemporaryPassword',
    key: 'isTemporaryPassword',
    sorter: true,
  },
  {
    title: 'Actions',
    key: 'action',
  },
];
const searchForm = ref();

const searchModel = ref({
  Account: '',
  Displayname: '',
});
const sortField = ref('id');
const sortOrder = ref('asc');
const filters = computed<Array<string>>(() => {
  const tmp = [];
  if (searchModel.value.Account !== '') {
    tmp.push(`account like ?`);
  }
  if (searchModel.value.Displayname !== '') {
    tmp.push(`display_name like ?`);
  }

  return tmp;
});
const args = computed<Array<string>>(() => {
  const tmp: string[] = [];
  if (searchModel.value.Account !== '') {
    tmp.push(`%${searchModel.value.Account}%`);
  }
  if (searchModel.value.Displayname !== '') {
    tmp.push(`%${searchModel.value.Displayname}%`);
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
} = usePagination(getRoleMembers, {
  defaultParams: [
    {
      page: 1,
      pageSize: 10,
      sortField: 'id',
      sortOrder: 'asc' as SortOrder,
      filters: filters.value,
      args: args.value,
    },
    props.roleId,
  ],
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'pageSize',
  },
});

const fieldMap = new Map<String, string>([
  ['displayName', 'display_name'],
  ['id', 'id'],
  ['isTemporaryPassword', 'is_temporary_password'],
  ['lockoutEnabled', 'lockout_enabled'],
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
      sortOrder: sortOrder.value as SortOrder, // SortOrder[sortOrder.value as keyof typeof SortOrder],
      filters: filters.value,
      args: args.value,
    });
  }, 500);
};
const handleReset = () => {
  searchModel.value = {
    Account: '',
    Displayname: '',
  };
  searchForm.value.resetFields();
  setTimeout(() => {
    run({
      page: current.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value as SortOrder, // SortOrder[sortOrder.value as keyof typeof SortOrder],
      filters: filters.value,
      args: args.value,
    });
  }, 500);
};
const open = ref<boolean>(false);
const row = ref<UserInfo>({
  id: '',
  displayName: '',
});
const modalForm = ref();

const handleDelete = (Id: string) => {
  // DeleteUser(Id);
  console.log('delete', Id);
  reloadTable();
};

const handleOk = async () => {
  try {
    const v = await modalForm.value.validate();
    if (!v) {
      return;
    }
  } catch (error) {
    console.log('error submit:', error);
    return;
  }
  console.log('row', row.value);

  open.value = false;
  reloadTable();
};
const handleCancel = () => {
  modalForm.value.resetForm();
  open.value = false;
};

const onTableChange = (pagination: any, filters: any, sorters: any) => {
  current.value = pagination.current;
  pageSize.value = pagination.pageSize;
  if (sorters.field) {
    const fieldName = fieldMap.get(sorters.field);
    sortField.value = fieldName ?? sorters.field;

    sortOrder.value = sorters.order;
  } else {
    sortField.value = 'Id';
    sortOrder.value = 'asc';
  }
  console.log('filters', filters);

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
  <a-row :gutter="16" style="height: 400px; margin-bottom: 5px">
    <a-col :span="16">
      <a-page-header
        style="border: 1px solid rgb(235 237 240)"
        sub-title="User list page"
        title="Users"
      />
      <a-form ref="searchForm" :model="searchModel" layout="inline">
        <a-form-item label="Account">
          <a-input v-model:value="searchModel.Account" placeholder="Account" />
        </a-form-item>
        <a-form-item label="Displayname">
          <a-input
            v-model:value="searchModel.Displayname"
            placeholder="Displayname"
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
          <a-divider type="vertical" />
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
              <a-tooltip>
                <template #title>Delete</template>
                <a-popconfirm
                  placement="right"
                  title="Delete User"
                  @confirm="handleDelete(record.id)"
                >
                  <a-button :icon="h(DeleteOutlined)" danger />
                </a-popconfirm>
              </a-tooltip>
            </a-space>
          </template>
          <template v-else-if="column.key === 'lockoutEnabled'">
            <a-switch v-model:checked="record.lockoutEnabled" size="small" />
          </template>
        </template>
      </a-table>
      <a-modal
        v-model:open="open"
        title="Edit User Info"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-col>
  </a-row>
</template>

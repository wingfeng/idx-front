<script lang="ts" setup>
import type { UserInfo } from '#/types/user';

import { computed, h, reactive, ref, watch } from 'vue';
import { usePagination } from 'vue-request';

import { DeleteOutlined } from '@ant-design/icons-vue';
import { debounce } from 'lodash-es';

import { getUserList } from '#/api';
import { addMembers, deleteMembers, getMembers } from '#/api/system/group';
import { SortOrder } from '#/types/enum';

const props = defineProps<{
  id?: number;
}>();
const columns = [
  {
    title: 'User Name',
    dataIndex: 'userName',
    key: 'userName',
    name: 'userName',
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
    title: 'Actions',
    key: 'action',
  },
];
// const searchForm = ref();

const searchModel = ref({
  Account: '',
  Displayname: '',
});
const sortField = ref('id');
const sortOrder = ref('asc');
const filters = computed<Array<string>>(() => {
  const tmp = [];
  if (searchModel.value.Account !== '') {
    tmp.push(`user_name like ?`);
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
} = usePagination(getMembers, {
  defaultParams: [
    {
      page: 1,
      pageSize: 10,
      sortField: 'id',
      sortOrder: 'asc' as SortOrder,
      filters: filters.value,
      args: args.value,
    },
    props.id,
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

const open = ref<boolean>(false);
const row = ref<UserInfo>({
  id: '',
  displayName: '',
});
const modalForm = ref();

const handleRemove = (Id: string) => {
  deleteMembers(props.id, Id);

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

  run(
    {
      page: current.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value as SortOrder,
      filters: filters.value,
      args: args.value,
    },
    props.id,
  );
};

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const fetchUser = debounce((value) => {
  console.log('fetching user', value);

  state.data = [];
  state.fetching = true;
  getUserList({
    page: 1,
    pageSize: 10,
    sortField: 'user_name',
    sortOrder: 'asc' as SortOrder,
    filters: ['user_name like ?'],
    args: [`%${value}%`],
  }).then((res) => {
    const data = res.list.map((user) => ({
      label: `${user.displayName}`,
      value: user.id,
    }));
    state.data = data;
    state.fetching = false;
    console.log('state', state);
  });
}, 300);
const handleAddMember = () => {
  console.log('state.value', state.value);

  const ids: string[] = [];
  state.value.forEach((s) => {
    ids.push(s.value);
  });
  console.log('ids', ids);
  addMembers(props.id, ids).then(() => {
    reloadTable();
    state.data = [];
    state.value = [];
  });
};
watch(state.value, () => {
  state.data = [];
  state.fetching = false;
});
</script>
<template>
  <a-row :gutter="16" style="margin-bottom: 5px">
    <a-col :span="16">
      <a-select
        v-model:value="state.value"
        :filter-option="false"
        :not-found-content="state.fetching ? undefined : null"
        :options="state.data"
        label-in-value
        mode="multiple"
        placeholder="Select users"
        style="width: 100%"
        @search="fetchUser"
      >
        <template v-if="state.fetching" #notFoundContent>
          <a-spin size="small" />
        </template>
      </a-select>
      <a-button type="primary" @click="handleAddMember">
        <template #icon></template>
        Add Member
      </a-button>
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
                  title="Remove Role Member"
                  @confirm="handleRemove(record.id)"
                >
                  <a-button :icon="h(DeleteOutlined)" danger />
                </a-popconfirm>
              </a-tooltip>
            </a-space>
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

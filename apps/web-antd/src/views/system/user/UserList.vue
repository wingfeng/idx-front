<script lang="ts" setup>
import type { OrgUnitInfo } from '#/types/orgUnit';
import type { UserInfo } from '#/types/user';

import { computed, h, onMounted, ref } from 'vue';
import { usePagination } from 'vue-request';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Modal, Tag } from 'ant-design-vue';

import { getOUTree } from '#/api/system/ou';
import { newId } from '#/api/system/util';
import { DeleteUser, GetUserPage, ResetPassword, SaveUser } from '#/store/user';
import { SortOrder } from '#/types/enum';

import UserForm from './UserForm.vue';

const fieldNames = {
  title: 'displayName',
  key: 'id',
  children: 'children',
};
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const treeData = ref<Array<OrgUnitInfo>>([
  { displayName: 'Expand to load', id: BigInt(0), children: [] },
]);
// const treeData = ref({});
const orgTree = ref();
const selectNode = ref<OrgUnitInfo>({});
onMounted(() => {
  return getOUTree('')
    .then((res) => {
      console.log('treeData', res);
      const items = res.items;
      treeData.value = items;
      orgTree.value = items[0];
      if (
        items.length > 0 &&
        items[0] !== undefined &&
        items[0].id !== undefined
      ) {
        selectedKeys.value.push(String(items[0].id));
      }
    })
    .catch((error) => {
      console.log('err', error);
    });
});

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'Id',
    sorter: true,
    defaultSortOrder: 'ascend',
  },

  {
    title: 'User Name',
    dataIndex: 'userName',
    key: 'userName',
    name: 'userName',
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

  if (selectedKeys.value.length > 0 && selectedKeys.value[0] !== undefined) {
    tmp.push(`ou_id = ?`);
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
  if (selectedKeys.value.length > 0 && selectedKeys.value[0] !== undefined) {
    tmp.push(selectedKeys.value[0]);
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
} = usePagination(GetUserPage, {
  defaultParams: [
    {
      page: 1,
      pageSize: 10,
      sortField: 'id',
      sortOrder: SortOrder.Asc,
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
const onSelect = (treeNode: any, e: any) => {
  // console.log('selected node', e);
  selectNode.value = e.node.dataRef;
  run({
    page: current.value,
    pageSize: pageSize.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value as SortOrder, // SortOrder[sortOrder.value as keyof typeof SortOrder],
    filters: filters.value,
    args: args.value,
  });
  console.log('selected node', treeNode);
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
      sortOrder: sortOrder.value as SortOrder,
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
const handleEdit = (record: UserInfo) => {
  row.value = record;

  open.value = true;
};
const handleDelete = (Id: string) => {
  DeleteUser(Id);

  reloadTable();
};
const showNewPwd = ref<boolean>(false);
const newPwd = ref<string>('');
const handleResetpassword = async (Id: number, userName: string) => {
  ResetPassword(Id).then((pwd) => {
    Modal.warning({
      title: `Password only show once`,
      content: h('div', {}, [
        h('p', {}, `user ${userName} password is resetted to`),
        h(Tag, { color: 'red' }, `${pwd.NewPwd}`),
      ]),
      onOk() {
        reloadTable();
      },
    });
  });
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
  SaveUser(row.value);
  open.value = false;
  reloadTable();
};
const handleCancel = () => {
  modalForm.value.resetForm();
  open.value = false;
};
const handleNew = async () => {
  const resp = await newId();
  row.value = {
    id: resp.id,
    ou: selectNode.value.name,
    ouId: selectNode.value.id,
  };
  open.value = true;
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
  <a-row :gutter="16" style="margin-bottom: 5px">
    <a-col :span="4">
      <a-tree
        ref="orgTree"
        v-model:expanded-keys="expandedKeys"
        v-model:selected-keys="selectedKeys"
        :field-names="fieldNames"
        :tree-data="treeData"
        style="height: 400px; margin-bottom: 5px"
        @select="onSelect"
      />
    </a-col>

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
              <a-tooltip>
                <template #title> Edit</template>
                <a-button
                  :icon="h(EditOutlined)"
                  type="primary"
                  @click="handleEdit(record)"
                />
              </a-tooltip>
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
              <a-tooltip>
                <template #title>Reset Password</template>
                <a-popconfirm
                  placement="right"
                  title="Reset Password"
                  @confirm="handleResetpassword(record.id, record.account)"
                >
                  <a-button :icon="h(RollbackOutlined)" danger />
                </a-popconfirm>
              </a-tooltip>
            </a-space>
          </template>
          <template v-else-if="column.key === 'lockoutEnabled'">
            <a-switch v-model:checked="record.lockoutEnabled" size="small" />
          </template>
          <template v-else-if="column.key === 'isTemporaryPassword'">
            <a-switch
              v-model:checked="record.isTemporaryPassword"
              size="small"
            />
          </template>
        </template>
      </a-table>
      <a-modal
        v-model:open="open"
        title="Edit User Info"
        @cancel="handleCancel"
        @ok="handleOk"
      >
        <UserForm ref="modalForm" :form-model="row" :org-tree-data="treeData" />
      </a-modal>
      <a-modal v-model:open="showNewPwd" title="New Password">
        User password is resetted to: <a-tag color="red">{{ newPwd }}</a-tag>
      </a-modal>
    </a-col>
  </a-row>
</template>

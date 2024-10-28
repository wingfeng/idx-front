<script lang="ts" setup>
import type { ScopeInfo } from '#/types/scope';

import { computed, h, ref } from 'vue';
import { usePagination } from 'vue-request';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Divider, message, Modal } from 'ant-design-vue';

import { delScope, getScopeList } from '#/api';
import { SaveAPI } from '#/store/apis';
import { SortOrder } from '#/types/enum';

import ScopeForm from './ScopeForm.vue';

const [messageApi, contextHolder] = message.useMessage();

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'Id',
    sorter: true,
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    key: 'Enabled',
    sorter: true,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'Name',
    name: 'Name',
    sorter: true,
    filtered: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'Description',
    filtered: true,
  },
  {
    title: 'Actions',
    key: 'action',
  },
];

const sortField = ref('id');
const sortOrder = ref('asc');
const searchModel = ref({
  Name: '',
  Description: '',
});
const filters = computed<Array<string>>(() => {
  const tmp: Array<string> = [];
  if (searchModel.value.Name !== '') {
    tmp.push(`name like ?`);
  }
  if (searchModel.value.Description !== '') {
    tmp.push(`description like ?`);
  }
  return tmp;
});
const args = computed<Array<string>>(() => {
  const tmp = [];
  if (searchModel.value.Name !== '') {
    tmp.push(`%${searchModel.value.Name}%`);
  }
  if (searchModel.value.Description !== '') {
    tmp.push(`%${searchModel.value.Description}%`);
  }
  return tmp;
});
const {
  data: dataSource,
  run,
  loading,
  total,
  current,
  pageSize,
} = usePagination(getScopeList, {
  defaultParams: [
    {
      page: 1,
      pageSize: 10,
      sortField: 'id',
      sortOrder: SortOrder.Asc,
      filters: [],
      args: [],
    },
  ],
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'pageSize',
  },
});

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}));
const searchForm = ref();

const reloadTable = () => {
  setTimeout(() => {
    run({
      page: current.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value as SortOrder,
      filters,
      args,
    });
  }, 500);
};
const handleSearch = () => {
  console.log('searchModel', searchModel.value);
  reloadTable();
};
const handleReset = () => {
  searchModel.value = {
    Name: '',
    Description: '',
  };
  searchForm.value.resetFields();
  reloadTable();
};
const open = ref<boolean>(false);
const row = ref<ScopeInfo>();
const modalForm = ref();
const handleEdit = (record) => {
  row.value = record;

  open.value = true;
};
const handleDelete = (Id: string) => {
  Modal.confirm({
    title: `Deleting Scope ${Id}`,
    //  icon: ExclamationCircleOutlined,
    content: `Are you sure delete this Scope ${Id}?`,
    onOk() {
      delScope(Id)
        .then(() => {
          reloadTable();
        })
        .catch((error) => {
          messageApi.warning(error);
          console.log(error);
        });
    },
    onCancel() {
      console.log('Cancel');
    },
  });
  console.log('record', Id);
};

const handleOk = async () => {
  try {
    const v = await modalForm.value.validate();
    if (!v) {
      return;
    }
    console.log('form validate', v);
  } catch (error) {
    console.log('error submit:', error);
    return;
  }
  SaveAPI(row.value);
  open.value = false;
  reloadTable();
};
const handleCancel = () => {
  modalForm.value.resetForm();
  open.value = false;
};
const handleNew = () => {
  row.value = {
    id: 0,
    enabled: true,
    name: '',
    description: '',
  };
  open.value = true;
};
const onTableChange = (pagination: any, filters: any, sorters: any) => {
  current.value = pagination.current;
  pageSize.value = pagination.pageSize;
  if (sorters.field) {
    const fieldName = sorters.field;
    sortField.value = fieldName ?? sorters.field;

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
  });
};
</script>
<template>
  <div class="p-5">
    <context-holder />
    <a-page-header
      style="border: 1px solid rgb(235 237 240)"
      sub-title="Scopes list page"
      title="Scopes"
    />
    <a-form ref="searchForm" :model="searchModel" layout="inline">
      <a-form-item label="Name">
        <a-input v-model:value="searchModel.Name" placeholder="Name" />
      </a-form-item>
      <a-form-item label="Description">
        <a-input
          v-model:value="searchModel.Description"
          placeholder="Description"
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
            <a-button
              :icon="h(DeleteOutlined)"
              danger
              @click="handleDelete(record.id)"
            >
              Delete
            </a-button>
          </a-space>
        </template>
        <template v-else-if="column.key === 'Enabled'">
          <a-checkbox v-model:checked="record.enabled" />
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="open"
      title="Edit Client Info"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <ScopeForm ref="modalForm" :form-model="row" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { GroupInfo } from '#/types/group';

import { computed, h, onMounted, ref } from 'vue';
import { usePagination } from 'vue-request';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Divider, Modal } from 'ant-design-vue';

import { del, getList, save } from '#/api/system/group';
import { newId } from '#/api/system/util';
import { SortOrder } from '#/types/enum';

import GroupForm from './GroupForm.vue';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'Id',
    sorter: true,
    defaultSortOrder: 'ascend',
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
const sortOrder = ref(SortOrder.Asc);
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
} = usePagination(getList, {
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
      filters: filters.value,
      args: args.value,
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
const row = ref<GroupInfo>();
const modalForm = ref();
const handleEdit = (record) => {
  row.value = record;

  open.value = true;
};
const handleDelete = (Id: string, name: string) => {
  Modal.confirm({
    title: `Deleting Group ${Id}`,
    //  icon: ExclamationCircleOutlined,
    content: `Are you sure delete this group: ${name}?`,
    onOk() {
      del(Id).then(() => reloadTable());
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
  save(row.value);
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
    sortField.value = 'id';
    sortOrder.value = SortOrder.Asc;
  }

  run({
    page: current.value,
    pageSize: pageSize.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value as SortOrder,
    filters: filters.value,
  });
};

onMounted(() => {
  reloadTable();
});
</script>
<template>
  <div class="p-5">
    <a-page-header
      style="border: 1px solid rgb(235 237 240)"
      sub-title="Group list page"
      title="Groups"
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
              @click="handleDelete(record.id, record.name)"
            >
              Delete
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="open"
      :mask-closable="false"
      title="Edit Group Info"
      width="50%"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <GroupForm ref="modalForm" :form-model="row" />
    </a-modal>
  </div>
</template>

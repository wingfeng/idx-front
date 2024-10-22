<script lang="ts" setup name="Secret">
import type { GenSecretParam } from '#/types/client';

import { computed, ref, watch } from 'vue';
import { useRequest } from 'vue-request';

import { DeleteOutlined } from '@ant-design/icons-vue';
import dayjs, { Dayjs } from 'dayjs';

import { delSecret, generateSecret, getSecrets } from '#/api/oauth2/client';
import { formatDate } from '#/utils/format';

const props = defineProps<{
  clientId: number;
}>();

const { data, run, refresh, loading } = useRequest(getSecrets, {
  defaultParams: [props.clientId],
});
const secrets = computed(() => data.value?.Secrets);
const handleDelete = async (id: number) => {
  await delSecret(id);
  refresh();
};
const newExpiration = ref<Dayjs>(dayjs().add(1, 'year'));
const genParam: GenSecretParam = ref({
  client_id: props.clientId,
  expiration: newExpiration,
});

const genError = ref('');
const newSecret = ref('');
const openGen = ref(false);
const onGenerate = async () => {
  try {
    console.log(genParam);
    const newSeq = await generateSecret(genParam.value);
    newSecret.value = newSeq.Secret;
    genParam.value.name = '';
    console.log(`new secret:${newSecret.value}`);
    refresh();
    openGen.value = false;
  } catch (error) {
    genError.value = error.msg;
  }
};

watch(
  () => props.clientId,
  () => {
    run(props.clientId);
    newSecret.value = '';
    genError.value = '';
  },
);
</script>
<template>
  <a-button
    type="link"
    @click="
      openGen = true;
      genError = '';
    "
  >
    Generate Secrete
  </a-button>
  <div v-if="newSecret !== ''">
    New secret only show once:
    <a-tag color="warning">{{ newSecret }}</a-tag> copy it before you close this
    dialog
  </div>
  <a-list :data-source="secrets" :loading="loading" item-layout="horizontal">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #description>
            Expired at: {{ formatDate(item.Expiration) }}
          </template>
          <template #title> {{ item.id }} {{ item.name }} </template>
        </a-list-item-meta>
        <template #actions>
          <a-popconfirm
            title="Delete Client  "
            @confirm="handleDelete(item.id)"
          >
            <a-button type="link">
              <DeleteOutlined />
            </a-button>
          </a-popconfirm>
        </template>
      </a-list-item>
    </template>
  </a-list>
  <a-modal
    v-model:open="openGen"
    title="Generating Secret"
    width="30%"
    @ok="onGenerate"
  >
    <a-form>
      <a-form-item label="Name">
        <a-input v-model:value="genParam.name" aria-required="true" />
      </a-form-item>
      <a-form-item label="Expiration">
        <a-date-picker v-model:value="genParam.expiration" />
      </a-form-item>
    </a-form>
    <a-alert v-if="genError" :message="genError" type="error" />
  </a-modal>
</template>

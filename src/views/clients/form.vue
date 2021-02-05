<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="modelData"
      label-position="left"
      label-width="180px"
      style="width: 400px; margin-left: 50px"
    >
      <el-form-item label="ID" prop="title">
        <el-input readonly v-model="modelData.ID" />
      </el-form-item>

      <el-form-item label="客户端标识" prop="title">
        <el-input v-model="modelData.ClientID" />
      </el-form-item>
       <el-form-item label="客户端名称" prop="title">
        <el-input v-model="modelData.ClientName" />
      </el-form-item>
       <el-form-item label="客户端描述" prop="title">
        <el-input v-model="modelData.Description" type="textarea" />
      </el-form-item>
      <el-form-item label="LogoURI" prop="title">
        <el-input v-model="modelData.LogoURI" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch
          v-model="modelData.Enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
       <el-form-item label="需要用户确认">
        <el-switch
          v-model="modelData.RequireConsent"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
        <el-form-item label="允许离线访问">
        <el-switch
          v-model="modelData.AllowOfflineAccess"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close"> 取消 </el-button>
      <el-button type="primary" @click="updateData"> 保存 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { Save } from "@/api/clients/index";
export default {
  props: ["modelData", "title", "dialogVisible"],

  data() {
    return {
      temp: {},
      rules: {},
    };
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    updateData() {
    
      Save(this.modelData).then(() => {
        this.dialogVisible = false;
      });
    },
  },
};
</script>
<template>
  <div class="app-container">
       <div class="filter-container">
               <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
         </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.ID }}
        </template>
      </el-table-column>
      <el-table-column label="客户端标识" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClientID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户端名称">
        <template slot-scope="scope">
          {{ scope.row.ClientName }}
        </template>
      </el-table-column>

      <el-table-column label="Logo" width="110" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.LogoURI" width="80px" height="80px" :src="scope.row.LogoURI" title="logo" />
          <i v-else class="el-icon-document"></i>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="状态"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Updated_time"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination   layout="total,prev, pager, next" :total="total">
    </el-pagination>
  
      <dataform :modelData="row" :title="textMap[dialogStatus]" :dialogVisible.sync="dialogFormVisible"  />
    
  </div>
</template>

<script>
import { Page } from "@/api/clients";
import dataform from "./form.vue";
export default {
  components: { dataform },
  filters: {
    statusFilter(status) {
      if (status) return "success";
      else return "gray";
    },
  },
  data() {
    return {
      row:{},
      total: 0,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      Page().then((response) => {
        this.list = response.data.content;
        this.total = response.data.totalSize;
        this.listLoading = false;
      });
    },
    handleUpdate(row) {
      this.row = Object.assign({}, row); // copy obj     
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    handleCreate(){
      this.row={
        Enabled:true
      };
      this.dialogFormVisible=true;
      this.dialogStatus='create'
    }
  },
};
</script>

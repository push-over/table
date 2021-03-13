<template>
  <div ref="tableRef" class="basic-table">
    <h2 v-if="isFullscreenRef" class="basic-table--title">
      {{ entity.name }}
    </h2>
    <slot v-if="$scopedSlots['table-top']" name="table-top" />
    <div v-else class="basic-table--top">
      <slot v-if="$scopedSlots['table-top--left']" name="table-top--left" />
      <div v-else class="top-left">
        <el-input
          v-if="actionConfig.search.enabled"
          v-model="filter"
          :placeholder="actionConfig.search.label"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="refreshTable"
          />
        </el-input>
      </div>
      <div class="top-right">
        <template v-for="(action, actionKey) in actionConfig">
          <table-top-button
            v-if="action.position === 'top-right'"
            :key="actionKey"
            :action="action"
            @click="handleClickActionButton(actionKey)"
          />
        </template>
      </div>
    </div>

    <el-table
      v-loading="loading"
      v-bind.sync="$attrs"
      :header-cell-style="{ backgroundColor: '#f5f7fa' }"
      :row-key="entity.key"
      v-on="$listeners"
      @selection-change="handleSelectionChange"
    >
      <template v-for="(column, index) in columns">
        <table-column
          :key="index"
          :default-props="column"
        >
          <template slot-scope="scope">
            <div v-if="column.name === 'actions'">
              <template v-for="(action, actionKey) in actionConfig">
                <table-cell-button
                  v-if="!action.position"
                  :key="actionKey"
                  :action="action"
                  @click="handleClickActionButton(actionKey, scope)"
                />
              </template>
            </div>
            <slot
              v-else-if="$scopedSlots[`body-cell-${column.name}`]"
              :name="`body-cell-${column.name}`"
              v-bind="scope"
            />
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </table-column>
      </template>
    </el-table>

    <div class="basic-table--pagination">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.pagerCount"
        background
        layout="sizes,total,prev,pager,next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <popup-form
      ref="formRef"
      v-model="isFormOpen"
      v-slot:default="{ value }"
      :title="entity.displayName"
      :default-value="defaultValue"
      @save="onSave"
    >
      <slot name="form" :item="value" />
    </popup-form>
  </div>
</template>

<script>
import TableTopButton from './components/TableTopButton.vue'
import TableCellButton from './components/TableCellButton.vue'
import TableColumn from './components/TableColumn.vue'
import PopupForm from './components/PopupForm.vue'

import { basicProps } from './props'
import { useAction } from './hooks/useAction'
import { useDelete } from './hooks/useDelete'
import { useFullScreen } from './hooks/useFullScreen'

export default {
  name: 'BasicTable',
  components: {
    TableTopButton,
    TableCellButton,
    TableColumn,
    PopupForm
  },
  inheritAttrs: false,
  props: basicProps,
  data() {
    return {
      loading: false,
      isFormOpen: false,
      isFullscreenRef: false,
      items: [],
      selected: [],
      filter: undefined,
      defaultValue: this.entity.defaultValue()
    }
  },
  computed: {
    actionConfig({ $props }) {
      return useAction.call(this, $props)
    }
  },
  watch: {
    items(value) {
      const data = this.$attrs.data
      data.splice(0, data.length, ...value)
    }
  },
  async mounted() {
    this.refreshTable()
  },
  beforeDestroy() {
    useFullScreen.call(this, {
      target: this.$refs.tableRef
    }).removeEventListener()
  },
  methods: {
    async refreshTable(
      _,
      refreshBefore,
      refreshAfter
    ) {
      refreshBefore && await refreshBefore()
      await this.onRequest()
      refreshAfter && await refreshAfter()
    },
    async fetchData(params) {
      try {
        const { data, total } = await this.entity.service[`get${this.entity.alias}List`]({
          params
        })

        return {
          items: data,
          count: total
        }
      } catch (error) {
        throw error
      }
    },
    async onRequest() {
      this.loading = true

      const searchableFields = this.columns.filter(column => column.searchable)
        .map(column => column.prop)

      const { currentPage, pageSize, pagerCount } = this.pagination
      const fetchCount = pageSize === 0 ? pagerCount : pageSize

      const params = {
        page: currentPage,
        page_size: fetchCount,
        [searchableFields[0]]: this.filter,
        ...this.fields
      }

      let data
      try {
        data = await this.fetchData({ ...params })
      } catch (error) {
        this.loading = false
        return
      }

      this.items = data.items
      this.pagination.pagerCount = parseInt(data.count)
      this.pagination.currentPage = currentPage
      this.pagination.pageSize = pageSize
      this.loading = false
    },
    handleClickActionButton(actionKey, { row } = {}) {
      this.$emit('click-action', actionKey, row)
      this.eventForwardingCenter(actionKey, row || {})
    },
    eventForwardingCenter(key, row) {
      const events = {
        delete: () => this.deleteItem(row),
        deleteBatch: () => this.deleteBatch(),
        create: () => this.specificJump(),
        edit: () => this.specificJump(row),
        screen: () => this.handleFullScreen(),
        quickCreate: () => this.$refs.formRef.editItem(),
        quickEdit: () => this.editItem(row)
      }
      return events[key]()
    },
    async onSave(data, isUpdating) {
      if (!isUpdating) {
        await this.entity.service[`create${this.entity.alias}`]({ data })
      } else {
        // const newData = {}
        // for (const defaultValueKey in this.defaultValue) {
        //   newData[defaultValueKey] = data[defaultValueKey]
        // }
        await this.entity.service[`update${this.entity.alias}`]({
          [this.entity.key]: data[this.entity.key],
          data
        })
      }
      refreshTable()
    },
    async editItem(row) {
      const result = await this.entity.service[`get${this.entity.alias}Detail`]({
        [this.entity.key]: row[this.entity.key],
        params: {
          lang: 'zh'
        }
      })
      this.$refs.formRef.editItem(result)
    },
    deleteItem(row) {
      useDelete.call(
        this,
        async() => await this.entity.service[`delete${this.entity.alias}`]({
          id: row.id
        }))
    },
    deleteBatch() {
      this.selected.length
        ? useDelete.call(
          this,
          () => console.log(this.selected, '------------>>>>>'))
        : this.$message.info(`请先选择要删除${this.entity.displayName}的数据！`)
    },
    async handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      await this.refreshTable()
    },
    async handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      await this.refreshTable()
    },
    handleSelectionChange(selected) {
      const ids = []
      selected.forEach(({ id }) => ids.push(id))
      this.selected = ids
    },
    handleFullScreen() {
      useFullScreen.call(this, {
        target: this.$refs.tableRef
      }).toggleFullscreen()
    },
    specificJump(row = {}) {
      this.$router.push(this.entity.route(row.id))
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-table {
  padding: 30px;
  width: 100%;
  height: 100vh;
  background: #ECF0F5;

  %top-pagination {
    display: flex;
    margin: 10px 0;
  }

  &--title {
    margin: 20px 0;
    font-size: 30px;
    font-weight: bold;
  }

  &--top {
    @extend %top-pagination;
    justify-content: space-between;

    .top-left {
      min-width: 300px;
    }

    .top-right {
      display: flex;
      align-items: flex-end;
    }
  }

  &--pagination {
    @extend %top-pagination;
    justify-content: flex-end;
  }
}

.basic-table:fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>

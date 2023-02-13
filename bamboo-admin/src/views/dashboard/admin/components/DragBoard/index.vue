<template>
  <div class="board-column">
    <div class="board-column-header">
      <input
        v-if="workStatus == 1"
        class="new-todo"
        autocomplete="off"
        :placeholder="`请输入${headerText}`"
        :value="`${headerText} ${drag?'拖拽中':''}`"
        @focus="todoFocus"
        @blur="todoBlur"
        @keyup.enter="addTodo"
      />
      <span v-if="workStatus != 1">{{ headerText }} {{drag?'拖拽中':''}}</span>
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      forceFallback="true"
      animation="1000"
      @start="onStart"
      @end="onEnd"
      @add="add"
      @sort="sort"
      :move="onMove"
    >
      <div v-for="element in list" :key="element.id" >
        <!-- 待办列表卡片 -->
        <el-card :body-style="{ padding: '0px' }" class="board-item">
          <div class="card-content">
            <!-- 待办状态-编辑框 -->
            <el-input
              v-if="workStatus == 1 && element.edit"
              v-model="element.content"
              ref="editContent"
              v-focus="element.edit"
              :autofocus="true"
              class="edit-input"
              @keyup.enter.native="doneEdit(element)"
              @blur="cancelEdit(element)"
            />
            <span v-else>{{ element.content }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ new Date(element.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</time>
              <!-- 废弃状态-删除按钮 -->
              <el-button v-if="workStatus == 4" type="text" size="small" class="button" @click="deleteClick(element)">
                <i class="el-icon-delete" />
              </el-button>
              <!-- 待办状态-编辑按钮 -->
              <el-button v-if="workStatus == 1" type="text" size="small" class="button" @click="handleEdit(element)">
                <i class="el-icon-edit-outline" />
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { sortTodo, addTodoList, delTodo, editTodo } from '@/api/facade/todo'
import { getDtRdId } from '@/utils/uuid'

export default {
  name: 'DragBoard',
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      currentDate: new Date()
    }
  },
  props: {
    workStatus: {
      type: String,
      default: '0'
    },
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return [{
          id: '',
          content: '',
          updateTime: '',
          edit: false,
          targetContent: ''
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'name'
    ])
  },
  methods: {
    async sortTodo(data) {
      await sortTodo(data)
    },
    async addTodoList(data) {
      await addTodoList(data)
    },
    async delTodo(data) {
      await delTodo(data)
    },
    async editTodo(data) {
      await editTodo(data)
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    onStart() {
      this.drag = true
    },
    onEnd() {
      this.drag = false
    },
    add({ from, to, item, clone, oldIndex, newIndex }) {
    },
    sort({ from, to, item, clone, oldIndex, newIndex }) {
      const data = {
        userId: this.userId,
        workStatus: this.workStatus,
        list: this.list
      }
      this.sortTodo(data)
    },
    // move回调方法
    onMove({ draggedContext, relatedContext }, originalEvent) {
      // console.log(e.draggedContext.element)
      // console.log(e.relatedContext.element)
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        const currentTime = new Date()
        const data = {
          id: getDtRdId(4),
          userId: this.userId,
          workStatus: this.workStatus,
          content: text,
          updateTime: currentTime,
          edit: false
        }
        this.list.push(data)
        // 数据持久化
        this.addTodoList(data)
      }
      e.target.value = ''
    },
    todoFocus(e) {
      e.target.value = ''
    },
    todoBlur(e) {
      e.target.value = this.headerText
    },
    // 已丢弃待办删除
    deleteClick(item) {
      this.list.forEach((it, index, temp) => {
        if (it === item) {
          temp.splice(index, 1)
        }
      })
      // 删除持久化
      item.userId = this.userId
      item.workStatus = this.workStatus
      this.delTodo(item)
    },
    handleEdit(element) {
      element.edit = true
      element.targetContent = element.content
      this.$nextTick(() => {
        this.$refs.editContent[0].focus()
      })
    },
    doneEdit(element) {
      element.edit = false
      element.updateTime = new Date()
      element.userId = this.userId
      element.targetContent = ''
      // 数据持久化
      this.editTodo(element)
    },
    cancelEdit(element) {
      element.edit = false
      element.content = element.targetContent
    }
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 280px;
  min-height: 100px;
  margin-top: 20px;
  height: auto;
  overflow: hidden;
  background: #e6e6e6;
  border-radius: 3px;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 10px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }
  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    .board-item {
      cursor: pointer;
      width: 260px;
      min-height: 60px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 26px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }

  .card-content{
    padding: 6px;
    font-size: 15px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .button {
    padding: 0;
    float: right;
    color: #999;
    display:none; // 元素默认隐藏
  }
  .card-content:hover .button {
    display:block;
  }
  .bottom {
    margin-top: 10px;
    line-height: 14px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .new-todo {
    width: 240px;
    color: #fff;
    text-align: center;
    padding: 10px 10px 8px 10px; // 上右下左
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }
}
</style>

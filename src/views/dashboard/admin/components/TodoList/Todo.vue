<template>
    <li :class="{ completed: todo.done, editing: editing }" class="todo">
        <div class="view">
            <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
            <label @dblclick="editing = true" v-text="todo.text" />
            <button class="destroy" @click="deleteTodo(todo)" />
        </div>
        <input v-show="editing" v-focus="editing" :value="todo.text" class="edit" @keyup.enter="doneEdit"
            @keyup.esc="cancelEdit" @blur="doneEdit" />
    </li>
</template>

<script lang="ts">
import { ref, nextTick, ObjectDirective } from 'vue'
import { TodoItem } from './use-todo'

const DELETE_TODO_EVENT = "deleteTodo"
const EDIT_TODO_EVENT = "editTodo"
const TOGGLE_TODO_EVENT = "toggleTodo"

</script>

<script lang="ts" setup>
// 自定义指定的命名方法必须是vNameOfDirective
// see https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%87%E4%BB%A4
const vFocus: ObjectDirective<HTMLElement, boolean> = {
    mounted(el, { value }) {
        if (value) {
            nextTick(() => el.focus())
        }
    }
}

const props = withDefaults(defineProps<{
    todo: TodoItem
}>(), {
    todo: () => ({} as TodoItem)
})

const emit = defineEmits([DELETE_TODO_EVENT, EDIT_TODO_EVENT, TOGGLE_TODO_EVENT])

const editing = ref(false)

function deleteTodo(todo: TodoItem) {
    emit(DELETE_TODO_EVENT, todo)
}
function editTodo({ todo, value }: { todo: TodoItem, value: string }) {
    emit(EDIT_TODO_EVENT, { todo, value })
}
function toggleTodo(todo: TodoItem) {
    emit(TOGGLE_TODO_EVENT, todo)
}
function doneEdit(e: KeyboardEvent | FocusEvent) {
    const value = (e.target as HTMLInputElement).value.trim()
    if (!value) {
        emit(DELETE_TODO_EVENT, props.todo)
    } else if (editing.value) {
        emit(EDIT_TODO_EVENT, { todo: props.todo, value })
        editing.value = false
    }
}
function cancelEdit(e: KeyboardEvent) {
    (e.target as HTMLInputElement).value = props.todo.text
    editing.value = false
}

defineExpose({
    editTodo
})

</script>

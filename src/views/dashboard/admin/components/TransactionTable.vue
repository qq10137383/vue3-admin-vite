<template>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
        <el-table-column label="Order_No" min-width="200">
            <template v-slot="scope">{{ orderNoFilter(scope.row.order_no) }}</template>
        </el-table-column>
        <el-table-column label="Price" width="195" align="center">
            <template v-slot="scope">¥{{ $filters.toThousandFilter(scope.row.price) }}</template>
        </el-table-column>
        <el-table-column label="Status" width="100" align="center">
            <template v-slot="{ row }">
                <el-tag :type="statusFilter(row.status)">{{ row.status }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TransactionVo, transactionList } from '@/api/remote-search'

const list = ref<TransactionVo[]>([])

function orderNoFilter(str: string) {
    return str.substring(0, 30)
}
function statusFilter(status: 'success' | 'pending') {
    const statusMap: Record<typeof status, 'success' | 'danger'> = {
        success: 'success',
        pending: 'danger'
    }
    return statusMap[status]
}
function fetchData() {
    transactionList().then(response => {
        list.value = response.data.items.slice(0, 8)
    })
}

fetchData()

</script>

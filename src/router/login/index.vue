<template lang="pug">
Row(:gutter="16")
  Col(span="4")
    Input(label="au_token" v-model="au")
    Input(label="account_id" v-model="accountId" @blur="blur")
</template>
<script>
import Helper from '@/libs/helper'
export default {
  data() {
    return {
      au: '',
      accountId: '',
    }
  },
  methods: {
    blur() {
      Helper.cookie('au_token', this.au, {
        path: '/',
        expires: 3000,
        domain: 'localhost',
      })
      Helper.cookie('account_id', this.accountId, {
        path: '/',
        expires: 3000,
        domain: 'localhost',
      })
      Helper.cookie('c_token', '7RBM885e60TpUjnSpcLkwU1hAsfnzDPz', {
        path: '/',
        expires: 3000,
        domain: 'localhost',
      })
      location.href = '/'
    },
  },
  created() {},
}
</script>

<template>
  <div>
    <kup-lazy
      ref="dataTable"
      component-name="kup-data-table"
      :data.prop="data"
    ></kup-lazy>

    <ul>
      <li v-if="action"
        >Clicked action: text: {{ action.text }} - icon: {{ action.icon }}</li
      >
      <li v-if="actionIndex >= 0">Action index: {{ actionIndex }}</li>
      <li v-if="actionType">Action type: {{ actionType }}</li>
      <li v-if="row">Row: {{ row }}</li>
    </ul>
  </div>
</template>

<script>
import { dataTableWithCommandsMatching } from '@/mock/dataTable';

export default {
  data() {
    return {
      data: {
        data: dataTableWithCommandsMatching,
        commands: [
          {
            obj: {
              k: '000050',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'view-quilt',
            text: 'Scheda',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000050',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'delete',
            text: 'Elimina',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000051',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'delete',
            text: 'Elimina',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000052',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'settings',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000052',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000052',
              p: 'COD_VER',
              t: 'VO',
            },
            icon: 'delete',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'account',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
          {
            obj: {
              k: '000053',
              p: 'COD_VER',
              t: 'VO',
            },
            text: 'test',
            icon: 'account',
            showIcon: 'true',
          },
        ],
        ['onkup-datatable-rowaction-item-click']: (e) => {
          const action = e.detail.action;
          const index = e.detail.index;
          const type = e.detail.type;
          const row = e.detail.row;
          this.actionType = type;
          this.row = row;

          if ('default' === type || 'variable' === type) {
            this.action = action;
            this.actionIndex = index;
          } else if ('expander' === type) {
            this.action = null;
            this.actionIndex = -1;

            e.target.data = { ...e.target.data };
          }
        },
      },
      action: null,
      actionIndex: -1,
      actionType: null,
      row: null,
    };
  },
};
</script>

<style scoped>
ul {
  margin-top: 1rem;
}
</style>

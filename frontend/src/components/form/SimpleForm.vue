<template lang="pug">
form(@submit.prevent='submit')
  slot(name='fields', v-bind='{fields, submit}')
  slot(name='activator', v-bind='{fields, submit}')
  button(type='submit') submit
</template>
<script lang='ts'>
import { RequestController } from '@/shared/RequestController.ts';
import { defineComponent, ref, watch, set, reactive } from 'vue';
import { useActions } from './actions';
import { useWatchers } from './watchers';

const t = (v) => {
  console.log(v)
  return Object.entries(v).reduce((acc, [key, value]) => {
    acc[key] = value.id ? value.id : value;
    return acc;
  }, {});
};
export default defineComponent({
  emits: ['success', 'fail'],
  props: {
    action: {
      type: Function,
      default: () => null,
    },
    initial: {
      default: () => ({}),
    },
    watchData: {
      default: false,
    },
    transformTo: {
      type: Function,
      default: t,
    },
  },
  setup(props, context) {
    const fields = reactive({});
    const { submit, ...actions } = useActions(props, fields, context);
    useWatchers(props, fields, actions);
    return {
      submit,
      fields,
    };
  },
});
</script>
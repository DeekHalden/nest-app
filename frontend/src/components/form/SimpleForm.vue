<template lang="pug">
form(@submit.prevent='submit')
  slot(name='fields', v-bind='{fields, submit}')
  slot(name='activator', v-bind='{fields, submit}')
  button(type='submit') submit
</template>

<script lang='ts'>
import { RequestController } from '@/shared/RequestController.ts';
import { defineComponent, ref, watch, set, reactive } from 'vue';

const t = (v) => {
  return Object.entries(v).reduce((acc, [key, value]) => {
    acc[key] = value.id ? value.id : value;
    return acc;
  }, {});
};

const SimpleForm = defineComponent({
  props: {
    action: {
      type: Function,
      default: () => null,
    },
    initial: {
      default: () => ({}),
    },
    watchData: {
      default: true,
    },
    transformTo: {
      type: Function,
      default: t,
    },
  },

  setup(props, context) {
    const fields = reactive({});

    const changeParentData = (value) => {
      Object.keys(fields).forEach((key) => {
        props.initial[key] = fields[key];
      });
    };

    const initializeData = (value = props.initial) => {
      const initValue = props.transformTo(value);
      Object.keys(initValue).forEach((key) => {
        fields[key] = initValue[key];
      });
    };

    watch(
      () => fields,
      (nVal) => {
        if (props.watchData) {
          changeParentData(nVal);
        }
      },
      { deep: true }
    );

    watch(
      () => props.initial,
      (value, old) => {
        if (
          !props.watchInitial &&
          !(old === null || typeof old === 'undefined')
        ) {
          return;
        }
        initializeData(value);
      },
      { deep: true, immediate: true }
    );

    const submit = async (): Promise<void> => {
      const res = await props.action(fields);
      return;
    };

    return {
      submit,
      fields,
    };
  },
});

export default SimpleForm;
</script>
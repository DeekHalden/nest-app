import { watch } from "vue";

export const useWatchers = (
  props: any,
  fields: Record<string, any>,
  depedents: any
) => {
  watch(
    () => fields,
    (nVal) => {
      if (props.watchData) {
        depedents.changeParentData(nVal);
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => props.initial,
    (value, old) => {
      if (
        !props.watchInitial &&
        !(old === null || typeof old === "undefined")
      ) {
        return;
      }
      depedents.initializeData(value);
    },
    { deep: true, immediate: true }
  );
};

export const useActions = (
  props: any,
  fields: Record<string, any>,
  context: any
) => {
  const changeParentData = (value: any) => {
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

  const submit = async (): Promise<void> => {
    try {
      const res = await props.action(fields);
      context.emit("success", res);
    } catch (error) {
      context.emit("fail", error);
    }
  };

  return {
    changeParentData,
    initializeData,
    submit,
  };
};

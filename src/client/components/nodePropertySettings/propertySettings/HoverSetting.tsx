import { useState } from 'react';
import { Form } from 'antd';
import Selector from '../../shared/Selector';

function HoverSetting({ data, onChangeData }) {
  const [form] = Form.useForm();
  const [properties, setProperties] = useState(data);

  const changeData = (key, value) => {
    form.validateFields().then(() => {
      const newPropperties = { ...properties, [key]: value };
      setProperties(newPropperties);
      onChangeData(newPropperties);
    });
  };

  return (
    <Form
      form={form}
      className="flex flex-col gap-2"
      initialValues={data}
      layout="vertical"
      autoComplete="off"
    >
      <Selector
        value={properties.selector}
        onChangeSetting={(key, value) => changeData(key, value)}
      ></Selector>
    </Form>
  );
}

export default HoverSetting;

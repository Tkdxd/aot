import { useState } from 'react';
import { Form, Input } from 'antd';

function OpenURLSetting({ data, onChangeData }) {
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
      <Form.Item
        hasFeedback
        rules={[{ type: 'url', required: true }]}
        name="url"
        label="URL"
        validateTrigger="onBlur"
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          onBlur={(evt) => changeData('url', evt.target.value)}
        />
      </Form.Item>
    </Form>
  );
}

export default OpenURLSetting;

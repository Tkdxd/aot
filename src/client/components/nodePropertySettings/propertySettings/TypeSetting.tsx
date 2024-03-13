import { useState } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import Selector from '../../shared/Selector';
import { TIME_SELECTOR } from '../../../../shared/constants/constants';

const timeSelectorOptions = TIME_SELECTOR.map((selector) => {
  return {
    label: selector,
    value: selector,
  };
});

function TypeSetting({ data, onChangeData }) {
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
        onChangeSetting={(key, value) => changeData(key, value)}
        value={undefined}
      ></Selector>
      <Form.Item hasFeedback name="content" label="Content">
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          onBlur={(evt) => changeData('content', evt.target.value)}
        />
      </Form.Item>
      <Form.Item hasFeedback name="delay" label="Delay">
        <InputNumber
          min={0}
          addonAfter={
            <Select
              defaultValue="second"
              options={timeSelectorOptions}
              onChange={(evt) => changeData('delay_time_selector', evt)}
            ></Select>
          }
          onBlur={(evt) => changeData('delay', evt.target.value)}
        />
      </Form.Item>
    </Form>
  );
}

export default TypeSetting;

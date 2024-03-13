import { useState } from 'react';
import { Checkbox, Col, Form, Row } from 'antd';
import { Typography } from 'antd';
import Selector from '../../shared/Selector';

function ClickSetting({ data, onChangeData }) {
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
      <Typography.Title level={5}>Options</Typography.Title>
      <Row className="border-dashed border-2 border-indigo-600 rounded-md !px-3 !py-2">
        <Col span={24}>
          <Form.Item hasFeedback name="dbClick" valuePropName="checked">
            <Checkbox
              onChange={(evt) => {
                changeData('dbClick', evt.target.checked);
              }}
            >
              Double click
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item hasFeedback name="randomClick" valuePropName="checked">
            <Checkbox
              onChange={(evt) => {
                changeData('randomClick', evt.target.checked);
              }}
            >
              Random click
            </Checkbox>
          </Form.Item>
        </Col>
        {properties.randomClick && (
          <Col span={12}>
            <Form.Item hasFeedback name="nDuplicated" valuePropName="checked">
              <Checkbox
                onChange={(evt) => {
                  changeData('nDuplicated', evt.target.checked);
                }}
              >
                Not duplicated
              </Checkbox>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
}

export default ClickSetting;

import { useState } from 'react';
import { Col, Form, InputNumber, Radio, Row } from 'antd';
import { Typography } from 'antd';
import Selector from '../../shared/Selector';

function ScrollSetting({ data, onChangeData }) {
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
        name="type"
        label="Type"
        rules={[{ required: true }]}
      >
        <Radio.Group
          value={properties.type}
          onChange={(evt) => changeData('type', evt.target.value)}
        >
          <Radio value={'page'}>Page</Radio>
          <Radio value={'selector'}>Selector</Radio>
          <Radio value={'pixel'}>Pixel</Radio>
        </Radio.Group>
      </Form.Item>
      {properties.type && (
        <>
          <Typography.Title level={5}>Options</Typography.Title>
          <Row
            className="border-dashed border-2 border-indigo-600 rounded-md !px-3 !py-2"
            gutter={8}
          >
            <Col span={24}>
              <Form.Item
                hasFeedback
                name="distancePerIntervalTime"
                label="Distance per interval time"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={100}
                  addonAfter="px"
                  className="w-full"
                  onBlur={(evt) =>
                    changeData('distancePerIntervalTime', evt.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                hasFeedback
                name="intervalTime"
                label="Interval Time"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  addonAfter="second"
                  className="w-full"
                  onBlur={(evt) => changeData('intervalTime', evt.target.value)}
                />
              </Form.Item>
            </Col>
            {
              {
                page: (
                  <Radio.Group
                    defaultValue="bottom"
                    className="w-full !my-2"
                    onChange={(evt) => changeData('option', evt.target.value)}
                  >
                    <Col span={12} className="w-1/2 !inline-block text-center">
                      <Radio value={'top'}>Top</Radio>
                    </Col>
                    <Col span={12} className="w-1/2 !inline-block text-center">
                      <Radio value={'bottom'}>Bottom</Radio>
                    </Col>
                  </Radio.Group>
                ),
                selector: (
                  <Col span={24}>
                    <Selector
                      onChangeSetting={(key, value) => changeData(key, value)}
                      value={undefined}
                    ></Selector>
                  </Col>
                ),
                pixel: (
                  <>
                    <Radio.Group
                      defaultValue="bottom"
                      className="w-full !my-2"
                      onChange={(evt) => changeData('option', evt.target.value)}
                    >
                      <Col
                        span={12}
                        className="w-1/2 !inline-block text-center"
                      >
                        <Radio value={'top'}>Top</Radio>
                      </Col>
                      <Col
                        span={12}
                        className="w-1/2 !inline-block text-center"
                      >
                        <Radio value={'bottom'}>Bottom</Radio>
                      </Col>
                    </Radio.Group>
                    <Col span={24}>
                      <Form.Item hasFeedback name="distance" label="Distance">
                        <InputNumber
                          min={0}
                          addonAfter="px"
                          className="w-full"
                          onBlur={(evt) =>
                            changeData('distance', evt.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </>
                ),
              }[properties?.type]
            }
          </Row>
        </>
      )}
    </Form>
  );
}

export default ScrollSetting;

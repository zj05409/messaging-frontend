/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Form,
  Input,
  message,
} from 'antd';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { REGISTER } from '../queries';

const Ctn = styled.div`
  margin: 100px auto;
  width: 600px;
`;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterForm({ roleName } : {roleName:string}) {
  const [register, result] = useMutation(REGISTER, {
    onError: (error) => {
      message.error(error.graphQLErrors[0]?.message || 'net Error');
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      if (roleName === 'User') {
        navigate('/login');
      }
    }
  }, [result.data]) // eslint-disable-line

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const { username, password, email } = values;
    register({ variables: { username, password, email } });
  };

  return (
    <Ctn>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          tooltip="What do you want others to call you?"
          rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Ctn>
  );
}

export default RegisterForm;

import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import {LOGIN} from '../queries'
import {Button, Form, Input, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import styled from 'styled-components';
import {LockOutlined, UserOutlined} from "@ant-design/icons";

const Ctn = styled.div`
  .login-form {
    max-width: 300px;
  }
  .login-form-forgot {
    float: right;
  }
  .ant-col-rtl .login-form-forgot {
    float: left;
  }
  .login-form-button {
    width: 100%;
  }
`

const LoginForm = () => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      message.error(error.graphQLErrors[0]?.message || 'net Error')
    },
  })

  const navigate =  useNavigate()

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.accessToken
      const roles =  result.data.login.roles
      localStorage.setItem('reservation-user-token', token)
      navigate(roles.includes('Admin')? '/createEmployee' : '/reservations',{ replace: true });
    }

  }, [result.data]) // eslint-disable-line

  const onFinish = (values: any) => {
    const {username, password} = values
    login({ variables: { username, password } })

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Ctn>
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{
              margin: '100px auto'
            }}
        >
          <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to="/register">register now!</Link>
          </Form.Item>
        </Form>
      </Ctn>
  );
}

export default LoginForm

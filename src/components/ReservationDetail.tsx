import {Button, DatePicker, Form, Input, InputNumber, List, message, Radio} from "antd";
import {CREATE_RESERVATION, FIND_RESERVATION, UPDATE_RESERVATION} from "../queries";
import {useMutation, useQuery} from "@apollo/client";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {useEffect} from "react";
import moment from "moment";

const Ctn = styled.div`
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
`
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

const ReservationDetail = () => {
    const {id:_originalId} = useParams()
    const id = _originalId === 'new' ? null : _originalId;
    const result = useQuery(FIND_RESERVATION, {
      fetchPolicy: "no-cache",
      variables: { idToSearch: id },
      skip: !id,
    })
  const [register, saveResult] = useMutation( id ? UPDATE_RESERVATION : CREATE_RESERVATION, {
    onError: (error) => {
      message.error(error.graphQLErrors[0]?.message || 'net Error')
    },
  })

  const navigate =  useNavigate()

  useEffect(() => {
    if (saveResult.data) {
     message.success('success')
      navigate('../')
    }

  }, [saveResult.data]) // eslint-disable-line

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    if(!values.expectedArriveTime) {
      message.error('Please select the expected arrive time!')
      return;
    }
    values._id = id;
    register({ variables: { reservation: values} })

  };

    if (result.loading) {
        return <div>loading...</div>
    }
    return (
      <Ctn>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={((r)=>{
          if (r) {
            return {...r, expectedArriveTime: moment(r.expectedArriveTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}
          }
          return r;
        })(id ? result.data.getReservation : null)}
        scrollToFirstError
        style={{width: '600px', margin: '100px auto'}}
      >
        <Form.Item
          name={['name']}
          label="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['contactInfo', 'email']}
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
          <Input type={'email'} />
        </Form.Item>

        <Form.Item
          name={['contactInfo', 'tel']}
          label="tel"
          rules={[
            {
              required: true,
              message: 'Please input your tel!',
            },
          ]}
          hasFeedback
        >
          <Input type={'tel'} />
        </Form.Item>

        <Form.Item
          name="expectedArriveTime"
          label="expected arrive time"
          tooltip="What do you want expectedArriveTime?"
          normalize={(value, prevValue, prevValues) => {
            return value;
          }}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          name={['table', 'personCount']}
          label="personCount"
          rules={[
            {
              required: true,
              message: 'Please input your personCount!',
            },
          ]}
          hasFeedback
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name={['table', 'babyCount']}
          label="babyCount"
          rules={[
            {
              required: true,
              message: 'Please input your babyCount!',
            },
          ]}
          hasFeedback
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name={['table', 'position']}
          label="position"
          rules={[
            {
              required: true,
              message: 'Please input your position!',
            },
          ]}
          hasFeedback
        >
          <Radio.Group options={['Lobby', 'PrivateRoom']} optionType="button" />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {id? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
      </Ctn>

    )
}


export default ReservationDetail

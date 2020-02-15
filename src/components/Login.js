import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const url = 'https://37b0a67e-4593-4027-b07a-93caf29e1814.mock.pstmn.io';
class LoginForm extends Component {
  handleSubmit = e => {
    const { history,location, logIn } = this.props;
    const { from } = location.state || { from: { pathname: "/compare" } };
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //   console.log(values)
        const user = {
            email: values.username,
            password: values.password
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }
          fetch(`${url}/users`, options).then(res=> res.json()).then(res=> {
              if(res.authenticated === 'true'){
                logIn()
                history.replace(from);
              }
          })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/#">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
export default withRouter(WrappedNormalLoginForm)
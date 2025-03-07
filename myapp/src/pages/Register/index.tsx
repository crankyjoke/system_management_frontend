import { Footer } from '@/components';
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet } from '@umijs/max';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: '100% 100%',
  },
}));

const Register: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Register Page</title>
      </Helmet>
      <div style={{ flex: '1', padding: '32px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle="Register a new account"
        >
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder="Username"
            rules={[{ required: true, message: 'Please enter a username!' }]}
          />
          <ProFormText
            name="email"
            fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
            placeholder="Email"
            rules={[{ required: true, message: 'Please enter an email!' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder="Password"
            rules={[{ required: true, message: 'Please enter a password!' }]}
          />
          <ProFormCheckbox name="agreement">
            I agree to the <a href="/terms">Terms and Conditions</a>
          </ProFormCheckbox>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

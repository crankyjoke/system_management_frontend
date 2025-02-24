import { PlusOutlined } from '@ant-design/icons';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from './ManagementService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  allowedTabs: string[];
}

const availableTabs = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Settings', value: 'settings' },
  { label: 'Users', value: 'users' },
  { label: 'Reports', value: 'reports' },
];

const UserManagement: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const actionRef = useRef<any>();

  React.useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <strong>{role}</strong>,
    },
    {
      title: 'Allowed Tabs',
      dataIndex: 'allowedTabs',
      key: 'allowedTabs',
      render: (tabs: string[]) => tabs.join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <>
          <a onClick={() => { setSelectedUser(record); setEditModalOpen(true); }}>Edit</a> |
          <a
            style={{ color: 'red', marginLeft: 10 }}
            onClick={async () => {
              await deleteUser(record.id);
              setUsers(users.filter((u) => u.id !== record.id));
            }}
          >Delete</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<User>
        headerTitle="User Management"
        actionRef={actionRef}
        rowKey="id"
        dataSource={users}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setModalOpen(true)}>
            <PlusOutlined /> Add User
          </Button>,
        ]}
      />

      {/* Add User Modal */}
      <ModalForm<User>
        title="Add New User"
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values) => {
          const success = await addUser({ id: users.length + 1, ...values });
          if (success) {
            setUsers([...users, success]);
            setModalOpen(false);
          }
        }}
      >
        <ProFormText name="name" label="Name" rules={[{ required: true }]} />
        <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
        <ProFormSelect
          name="role"
          label="Role"
          options={[{ label: 'Admin', value: 'Admin' }, { label: 'User', value: 'User' }]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="allowedTabs"
          label="Allowed Tabs"
          mode="multiple"
          options={availableTabs}
          rules={[{ required: true }]}
        />
      </ModalForm>

      {/* Edit User Modal */}
      {selectedUser && (
        <ModalForm<User>
          title="Edit User"
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialValues={selectedUser}
          onFinish={async (values) => {
            const success = await updateUser(selectedUser.id, values);
            if (success) {
              setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u)));
              setEditModalOpen(false);
            }
          }}
        >
          <ProFormText name="name" label="Name" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
          <ProFormSelect
            name="role"
            label="Role"
            options={[{ label: 'Admin', value: 'Admin' }, { label: 'User', value: 'User' }]}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="allowedTabs"
            label="Allowed Tabs"
            mode="multiple"
            options={availableTabs}
            rules={[{ required: true }]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default UserManagement;

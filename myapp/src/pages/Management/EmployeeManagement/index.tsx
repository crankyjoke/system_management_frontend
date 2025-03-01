import { PlusOutlined } from '@ant-design/icons';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from './ManagementService';

interface User {
  id: number;
  username: string;
  email: string | null;
  accesspage: number | null;
}

const availableTabs = [
  { label: 'Dashboard', value: 1 },
  { label: 'Settings', value: 2 },
  { label: 'Users', value: 3 },
  { label: 'Reports', value: 4 },
];

const UserManagement: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const actionRef = useRef<any>();

  useEffect(() => {
    fetchUsers().then((data) => {
      console.log('📡 API Response:', data);
      setUsers(data);
    });
  }, []);

  const columns = [
    {
      title: 'id',dataIndex: 'id',key:'id'
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string | null) => email || 'N/A' },
    {
      title: 'Allowed Tabs',
      dataIndex: 'accesspage',
      key: 'accesspage',
      render: (accesspage: number | null) => {
        if (!accesspage) return 'No Access';
        const tab = availableTabs.find((tab) => tab.value === accesspage);
        return tab ? tab.label : 'Unknown';
      },
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
              const success = await deleteUser(record.id);
              if (success) {
                message.success('✅ User deleted successfully');
                setUsers((prevUsers) => prevUsers.filter((u) => u.id !== record.id));
              } else {
                message.error('❌ Failed to delete user');
              }
            }}
          >
            Delete
          </a>
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
          try {
            const newUser = await addUser(values); // ✅ Backend generates ID

            if (newUser) {
              message.success("✅ User added successfully!");
              setUsers([...users, newUser]); // ✅ Correctly update state
              setModalOpen(false);
            } else {
              message.error("❌ Failed to add user");
            }
          } catch (error) {
            console.error("❌ Error adding user:", error);
            message.error("❌ An error occurred while adding the user");
          }
        }}
      >
        <ProFormText name="username" label="Username" rules={[{ required: true }]} />
        <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
        <ProFormText.Password name="password" label="Password" rules={[{ required: true }]} />
        <ProFormSelect
          name="accesspage"
          label="Allowed Tabs"
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
          <ProFormText name="username" label="Username" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
          <ProFormSelect
            name="accesspage"
            label="Allowed Tabs"
            options={availableTabs}
            rules={[{ required: true }]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default UserManagement;

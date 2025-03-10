import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Tabs, message } from 'antd';
import React, { useState, useEffect } from 'react';

interface Organization {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchOrganizations = async (): Promise<Organization[]> => {
  return [
    { id: 1, name: 'Org A', description: 'Description A' },
    { id: 2, name: 'Org B', description: 'Description B' },
  ];
};

const fetchUsersByOrganization = async (orgId: number): Promise<User[]> => {
  const users: Record<number, User[]> = {
    1: [
      { id: 101, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 102, name: 'Bob Smith', email: 'bob@example.com' },
    ],
    2: [
      { id: 201, name: 'Charlie Brown', email: 'charlie@example.com' },
      { id: 202, name: 'David Lee', email: 'david@example.com' },
    ],
  };
  return users[orgId] || [];
};

const addOrganization = async (organization: Organization): Promise<Organization> => {
  return { ...organization, id: Math.floor(Math.random() * 1000) };
};

const addUserToOrganization = async (user: User, orgId: number): Promise<User> => {
  return { ...user, id: Math.floor(Math.random() * 1000) };
};

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [addUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations().then((orgs) => setOrganizations(orgs));
  }, []);

  // Handle organization tab change
  const handleTabChange = async (activeKey: string) => {
    const orgId = parseInt(activeKey);
    const selectedOrg = organizations.find((org) => org.id === orgId) || null;
    setSelectedOrganization(selectedOrg);
    if (selectedOrg) {
      const usersData = await fetchUsersByOrganization(orgId);
      setUsers(usersData);
    }
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <PageContainer>
      {/* 🔹 Add Organization Button */}
      <Button
        type="primary"
        onClick={() => setAddUserModalOpen(true)}
        style={{ marginBottom: 20, marginRight: 10 }}
        disabled={!selectedOrganization}
      >
        <PlusOutlined /> Add User to Organization
      </Button>
      <Button
        type="primary"
        onClick={() => setAddUserModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
        <PlusOutlined /> Add Organization
      </Button>

      {/* 🔹 Tabs to switch between organizations */}
      <Tabs defaultActiveKey="all" type="card" onChange={handleTabChange}>
        {organizations.map((org) => (
          <Tabs.TabPane tab={org.name} key={org.id.toString()}>
            <ProTable<User>
              headerTitle={`Users in ${org.name}`}
              rowKey="id"
              dataSource={users}
              columns={userColumns}
              search={false}
              options={false}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>

      {/* 🔹 Add User Modal */}
      <ModalForm<User>
        title="Add User to Organization"
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onFinish={async (values) => {
          if (!selectedOrganization) return;
          try {
            const newUser = await addUserToOrganization(values, selectedOrganization.id);
            if (newUser) {
              message.success(`User "${newUser.name}" added to ${selectedOrganization.name}`);
              setUsers((prev) => [...prev, newUser]);
              setAddUserModalOpen(false);
            } else {
              message.error("Failed to add user");
            }
          } catch (error) {
            console.error("Error adding user:", error);
            message.error("An error occurred while adding the user");
          }
        }}
      >
        <ProFormText name="name" label="User Name" rules={[{ required: true }]} />
        <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
      </ModalForm>
    </PageContainer>
  );
};

export default OrganizationManagement;

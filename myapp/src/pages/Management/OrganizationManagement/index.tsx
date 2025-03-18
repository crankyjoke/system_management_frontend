import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Tabs, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';

import {
  fetchOrganizationTables,
  fetchUsersByOrganization,
  createOrganizationTable,
  insertUserIntoOrganization,
  Organization,
  User,
} from "@/pages/Management/OrganizationManagement/organizationService";

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);
  const [addOrgModalOpen, setAddOrgModalOpen] = useState<boolean>(false);

  // 🔹 Load users from "org_" + baseName
  const loadUsers = async (orgTable: string) => {
    if (!orgTable) return;
    const usersData = await fetchUsersByOrganization(orgTable);
    console.log("🟢 Final Users in loadUsers:", usersData);
    setUsers(usersData);
  };

  // 🔹 Fetch & load organization tables on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // e.g. ["org_sales", "org_marketing"]
      const orgTables = await fetchOrganizationTables();

      // convert to base names: ["sales", "marketing"]
      const cleanedOrgTables = orgTables.map((name) => ({
        name: name.replace(/^org_/, ""),
      }));

      setOrganizations(cleanedOrgTables);
      setLoading(false);

      // select first org if any
      if (cleanedOrgTables.length > 0) {
        const firstOrg = cleanedOrgTables[0].name; // e.g. "sales"
        setSelectedOrganization(firstOrg);         // store "sales"
        loadUsers(`org_${firstOrg}`);             // fetch "org_sales"
      }
    };
    loadData();
  }, []);

  // 🔹 Handle Organization Tab Change
  const handleTabChange = (activeKey: string) => {
    setSelectedOrganization(activeKey);         // store "sales" or "marketing"
    loadUsers(`org_${activeKey}`);             // e.g. "org_marketing"
  };

  // 🔹 Table Columns
  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    // { title: 'Name', dataIndex: 'name', key: 'name' },
  ];

  // 🔹 Loading Spinner
  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 50 }} />;
  }

  return (
    <PageContainer>
      {/* 🔹 Action Buttons */}
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
        onClick={() => setAddOrgModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
        <PlusOutlined /> Add Organization
      </Button>

      {/* 🔹 Tabs for Organizations */}
      <Tabs
        activeKey={selectedOrganization || ""}
        type="card"
        onChange={handleTabChange}
      >
        {organizations.map((org) => (
          <Tabs.TabPane tab={org.name} key={org.name}>
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

      {/* 🔹 Modal: Add User */}
      <ModalForm<User>
        title="Add User to Organization"
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onFinish={async (values) => {
          if (!selectedOrganization) {
            message.error("No organization selected.");
            return;
          }
          // => "org_sales" or "org_marketing"
          const orgTableName = `org_${selectedOrganization}`;
          const newUser = await insertUserIntoOrganization(values, orgTableName);

          if (newUser) {
            message.success(`User "${newUser.name}" added successfully.`);
            setUsers((prev) => [...prev, newUser]);
            setAddUserModalOpen(false);
          } else {
            message.error("Failed to add user.");
          }
        }}
      >
        <ProFormText name="id" label="User ID" rules={[{ required: true }]} />
        <ProFormText name="name" label="User Name" rules={[{ required: true }]} />
      </ModalForm>

      {/* 🔹 Modal: Add Organization */}
      <ModalForm<Organization>
        title="Add Organization"
        open={addOrgModalOpen}
        onOpenChange={setAddOrgModalOpen}
        onFinish={async (values) => {
          const sanitized = values.name.replace(/^org_/, "").trim();
          const success = await createOrganizationTable(sanitized);
          if (success) {
            message.success(`Organization "${sanitized}" added successfully.`);
            setOrganizations((prev) => [...prev, { name: sanitized }]);
            setAddOrgModalOpen(false);
          } else {
            message.error("Failed to add organization.");
          }
        }}
      >
        <ProFormText
          name="name"
          label="Organization Name"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default OrganizationManagement;

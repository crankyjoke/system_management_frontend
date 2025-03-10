import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { addUserPosition, fetchUserPositions, updateUserPosition } from "@/pages/Management/EmployeePositionManagement/PositionManagement";

// Define UserPosition interface
interface UserPosition {
  id: number;
  positionName: string[];
  balance: number;
  organization: string;
}

const UserPositionManagement: React.FC = () => {
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const actionRef = useRef<any>();

  // Separate State for Add and Edit Modals
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchUserPositions().then((data) => setUserPositions(data));
  }, []);

  // Open Edit Modal
  const handleEdit = (record: UserPosition) => {
    setSelectedUserPosition(record);
    setEditModalOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    {
      title: 'Position',
      dataIndex: 'positionName',
      key: 'position',
      render: (positionName: string[]) => positionName?.join(', ') || 'N/A',
    },
    { title: 'Organization', dataIndex: 'organization', key: 'organization' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserPosition) => (
        <>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 10 }}>Edit</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<UserPosition>
        headerTitle="User Position"
        actionRef={actionRef}
        rowKey="id"
        dataSource={userPositions}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setAddModalOpen(true); // Open Add Modal
            }}
          >
            <PlusOutlined /> Add Position
          </Button>,
        ]}
      />

      {/* 🔹 Add User Position Modal */}
      <ModalForm<UserPosition>
        title="Add New User Position"
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onFinish={async (values) => {
          try {
            const newPosition = await addUserPosition(values);
            if (newPosition) {
              message.success(`User Position with ID ${newPosition.id} added`);
              setUserPositions((prev) => [...prev, newPosition]);
              setAddModalOpen(false);
            } else {
              message.error("Failed to add User Position");
            }
          } catch (error) {
            console.error("Error adding position:", error);
            message.error("An error occurred while adding the user position");
          }
        }}
      >
        <ProFormText name="id" label="ID" rules={[{ required: true }]} />
        <ProFormText name="balance" label="Balance" rules={[{ required: true }]} />
        <ProFormSelect
          name="positionName"
          label="Position Name"
          mode="multiple"
          options={[
            { label: "Manager", value: "Manager" },
            { label: "Developer", value: "Developer" },
            { label: "HR", value: "HR" },
            { label: "Sales", value: "Sales" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="organization" label="Organization" rules={[{ required: true }]} />
      </ModalForm>

      {/* 🔹 Edit User Position Modal */}
      {selectedUserPosition && (
        <ModalForm<UserPosition>
          title="Edit User Position"
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialValues={selectedUserPosition}
          onFinish={async (values) => {
            try {
              const updatedPosition = await updateUserPosition({
                ...selectedUserPosition,
                ...values
              });

              if (updatedPosition) {
                message.success(`User Position with ID ${updatedPosition.id} updated`);
                setUserPositions(prev =>
                  prev.map(user => user.id === updatedPosition.id ? updatedPosition : user)
                );
                setEditModalOpen(false);
              } else {
                message.error("Failed to update User Position");
              }
            } catch (error) {
              console.error("Error updating position:", error);
              message.error("An error occurred while updating the user position");
            }
          }}
        >
          <ProFormText name="id" label="ID" disabled />
          <ProFormText name="balance" label="Balance" rules={[{ required: true }]} />
          <ProFormSelect
            name="positionName"
            label="Position Name"
            mode="multiple"
            options={[
              { label: "Manager", value: "Manager" },
              { label: "Developer", value: "Developer" },
              { label: "HR", value: "HR" },
              { label: "Sales", value: "Sales" },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText name="organization" label="Organization" rules={[{ required: true }]} />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default UserPositionManagement;

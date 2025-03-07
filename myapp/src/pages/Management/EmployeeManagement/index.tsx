// import { PlusOutlined } from '@ant-design/icons';
// import {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   FooterToolbar,
//   ModalForm,
//   PageContainer,
//   ProFormText,
//   ProFormSelect,
//   ProTable,
// } from '@ant-design/pro-components';
// import { Button, message } from 'antd';
// import React, { useRef, useState, useEffect } from 'react';
// import { fetchUsers, addUser, updateUser, deleteUser } from './ManagementService';
//
// interface User {
//   id: number;
//   username: string;
//   email: string | null;
//   accesspage: number | null;
//   password: string | null;
//   permission: string | null;
// }
//
// const availableTabs = [
//   { label: 'p1', value: 1 },
//   { label: 'p2', value: 2 },
//   { label: 'p3', value: 3 },
//   { label: 'p4', value: 4 },
// ];
//
// const UserManagement: React.FC = () => {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const actionRef = useRef<any>();
//
//   useEffect(() => {
//     fetchUsers().then((data) => {
//       console.log('📡 API Response:', data);
//       setUsers(data);
//     });
//   }, []);
//
//   const columns = [
//     {
//       title: 'id',dataIndex: 'id',key:'id'
//     },
//     { title: 'Username', dataIndex: 'username', key: 'username' },
//     {title: 'Password', dataIndex: 'password', key: 'password' },
//     { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string | null) => email || 'N/A' },
//     {title:'Permission', dataIndex: 'permission', key: 'permission'},
//     {
//       title: 'Allowed Tabs',
//       dataIndex: 'accesspage',
//       key: 'accesspage',
//       render: (accesspage: number | null) => {
//         if (!accesspage) return 'No Access';
//         const tab = availableTabs.find((tab) => tab.value === accesspage);
//         return tab ? tab.label : 'Unknown';
//       },
//     },
//
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: any, record: User) => (
//         <>
//           <a onClick={() => { setSelectedUser(record); setEditModalOpen(true); }}>Edit</a> |
//           <a
//             style={{ color: 'red', marginLeft: 10 }}
//             onClick={async () => {
//               const success = await deleteUser(record.id);
//               if (success) {
//                 message.success('✅ User deleted successfully');
//                 setUsers((prevUsers) => prevUsers.filter((u) => u.id !== record.id));
//               } else {
//                 message.error('❌ Failed to delete user');
//               }
//             }}
//           >
//             Delete
//           </a>
//         </>
//       ),
//     },
//   ];
//
//   return (
//     <PageContainer>
//       <ProTable<User>
//         headerTitle="User Management"
//         actionRef={actionRef}
//         rowKey="id"
//         dataSource={users}
//         columns={columns}
//         toolBarRender={() => [
//           <Button type="primary" onClick={() => setModalOpen(true)}>
//             <PlusOutlined /> Add User
//           </Button>,
//         ]}
//       />
//
//       {/* Add User Modal */}
//       <ModalForm<User>
//         title="Add New User"
//         open={modalOpen}
//         onOpenChange={setModalOpen}
//         onFinish={async (values) => {
//           try {
//             const newUser = await addUser(values);
//
//             if (newUser) {
//               message.success("✅ User added successfully!");
//               setUsers([...users, newUser]);
//               setModalOpen(false);
//             } else {
//               message.error("❌ Failed to add user");
//             }
//           } catch (error) {
//             console.error("❌ Error adding user:", error);
//             message.error("❌ An error occurred while adding the user");
//           }
//         }}
//       >
//         <ProFormText name="username" label="Username" rules={[{ required: false }]} />
//         <ProFormText name="email" label="Email" rules={[{ required: false, type: 'email' }]} />
//         <ProFormText name="password" label="Password" rules={[{ required: false }]} />
//         <ProFormText name="permission" label="Permission" rules={[{ required: false}]} />
//         <ProFormSelect
//           name="accesspage"
//           label="Allowed Tabs"
//           options={availableTabs}
//           rules={[{ required: true }]}
//         />
//       </ModalForm>
//
//       {/* Edit User Modal */}
//       {selectedUser && (
//         <ModalForm<User>
//           // title="Edit User"
//           // open={editModalOpen}
//           // onOpenChange={setEditModalOpen}
//           initialValues={selectedUser}
//           // onFinish={async (values) => {
//           //   console.log("🧐 Selected User Data:", selectedUser);
//           //
//           //   console.log("🔍 Permission Field:", values.permission);
//           //   const success = await updateUser(selectedUser.id, values);
//           //   if (success) {
//           //     // setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u)));
//           //     setEditModalOpen(false);
//           //   }
//           // }}
//           title="Edit User"
//           open={editModalOpen}
//           onOpenChange={setEditModalOpen}
//           // initialValues={{ ...selectedUser, permission: selectedUser?.permission || '' }}  // ✅ Ensure permission is included
//           onFinish={async (values) => {
//             // console.log("🚀 Submitted Values:", values);
//             // console.log("🔍 Permission Field:", values.permission);
//             const success = await updateUser(selectedUser.id, values);
//             if (success) {
//               setEditModalOpen(false);
//               message.success("Updated");
//               setUsers((prevUsers) =>
//                 prevUsers.map((user) =>
//                   user.id === selectedUser.id ? { ...user, ...values } : user
//                 )
//               );
//             }
//           }}
//         >
//           <ProFormText name="username" label="Username" rules={[{ required: true }]} />
//           <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
//           <ProFormText name="password" label="Password" rules={[{ required: false }]} />
//           <ProFormText name="permission" label="Permission" rules={[{ required: false}]} />
//           <ProFormSelect
//             name="accesspage"
//             label="Allowed Tabs"
//             options={availableTabs}
//             rules={[{ required: true }]}
//           />
//         </ModalForm>
//       )}
//     </PageContainer>
//   );
// };
//
// export default UserManagement;
// import { PlusOutlined } from '@ant-design/icons';
// import {
//   FooterToolbar,
//   ModalForm,
//   PageContainer,
//   ProFormText,
//   ProFormSelect,
//   ProTable,
// } from '@ant-design/pro-components';
// import { Button, message } from 'antd';
// import React, { useRef, useState, useEffect } from 'react';
// import { fetchUsers, addUser, updateUser, deleteUser } from './ManagementService';
//
// interface User {
//   id: number;
//   username: string;
//   email: string | null;
//   accesspage: number | null;
//   password: string | null;
//   permission: number | null; // Store permissions as a number
// }
//
// // Available pages mapped to binary bit positions
// const availableTabs = [
//   { label: 'p1', value: 1 << 0 }, // Binary 0001 (1)
//   { label: 'p2', value: 1 << 1 }, // Binary 0010 (2)
//   { label: 'p3', value: 1 << 2 }, // Binary 0100 (4)
//   { label: 'p4', value: 1 << 3 }, // Binary 1000 (8)
// ];
//
// const UserManagement: React.FC = () => {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const actionRef = useRef<any>();
//
//   useEffect(() => {
//     fetchUsers().then((data) => {
//       console.log('📡 API Response:', data);
//       setUsers(data);
//     });
//   }, []);
//
//   // Function to determine allowed pages based on binary permissions
//   const getAllowedPages = (permission: number | null) => {
//     if (!permission) return 'No Access';
//     return availableTabs
//       .filter((tab) => (permission & tab.value) !== 0)
//       .map((tab) => tab.label)
//       .join(', ');
//   };
//
//   const columns = [
//     { title: 'ID', dataIndex: 'id', key: 'id' },
//     { title: 'Username', dataIndex: 'username', key: 'username' },
//     { title: 'Password', dataIndex: 'password', key: 'password' },
//     { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string | null) => email || 'N/A' },
//     { title: 'Permission (Binary)', dataIndex: 'permission', key: 'permission', render: (perm: number | null) => perm?.toString(2) || '0' },
//     {
//       title: 'Allowed Tabs',
//       dataIndex: 'permission',
//       key: 'allowedTabs',
//       render: (permission: number | null) => getAllowedPages(permission),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: any, record: User) => (
//         <>
//           <a onClick={() => { setSelectedUser(record); setEditModalOpen(true); }}>Edit</a> |
//           <a
//             style={{ color: 'red', marginLeft: 10 }}
//             onClick={async () => {
//               const success = await deleteUser(record.id);
//               if (success) {
//                 message.success('✅ User deleted successfully');
//                 setUsers((prevUsers) => prevUsers.filter((u) => u.id !== record.id));
//               } else {
//                 message.error('❌ Failed to delete user');
//               }
//             }}
//           >
//             Delete
//           </a>
//         </>
//       ),
//     },
//   ];
//
//   return (
//     <PageContainer>
//       <ProTable<User>
//         headerTitle="User Management"
//         actionRef={actionRef}
//         rowKey="id"
//         dataSource={users}
//         columns={columns}
//         toolBarRender={() => [
//           <Button type="primary" onClick={() => setModalOpen(true)}>
//             <PlusOutlined /> Add User
//           </Button>,
//         ]}
//       />
//
//       {/* Add User Modal */}
//       <ModalForm<User>
//         title="Add New User"
//         open={modalOpen}
//         onOpenChange={setModalOpen}
//         onFinish={async (values) => {
//           try {
//             // Convert permission array to a binary number
//             const permission = Array.isArray(values.permission)
//               ? values.permission.reduce((acc: number, val: number) => acc | val, 0)
//               : 0;
//
//             const newUser = await addUser({ ...values, permission });
//
//             if (newUser) {
//               message.success("✅ User added successfully!");
//               setUsers([...users, newUser]);
//               setModalOpen(false);
//             } else {
//               message.error("❌ Failed to add user");
//             }
//           } catch (error) {
//             console.error("❌ Error adding user:", error);
//             message.error("❌ An error occurred while adding the user");
//           }
//         }}
//       >
//         <ProFormText name="username" label="Username" rules={[{ required: false }]} />
//         <ProFormText name="email" label="Email" rules={[{ required: false, type: 'email' }]} />
//         <ProFormText name="password" label="Password" rules={[{ required: false }]} />
//         <ProFormSelect
//           name="permission"
//           label="Allowed Tabs"
//           options={availableTabs}
//           mode="multiple" // Allows selecting multiple roles
//           rules={[{ required: true }]}
//         />
//       </ModalForm>
//
//       {/* Edit User Modal */}
//       {selectedUser && (
//         <ModalForm<User>
//           title="Edit User"
//           open={editModalOpen}
//           onOpenChange={setEditModalOpen}
//           initialValues={{
//             ...selectedUser,
//             permission: availableTabs
//               .filter((tab) => (selectedUser.permission ?? 0) & tab.value)
//               .map((tab) => tab.value),
//           }}
//           onFinish={async (values) => {
//             const permission = Array.isArray(values.permission)
//               ? values.permission.reduce((acc: number, val: number) => acc | val, 0)
//               : 0;
//
//             const success = await updateUser(selectedUser.id, { ...values, permission });
//
//             if (success) {
//               setEditModalOpen(false);
//               message.success("Updated");
//               setUsers((prevUsers) =>
//                 prevUsers.map((user) =>
//                   user.id === selectedUser.id ? { ...user, ...values, permission } : user
//                 )
//               );
//             }
//           }}
//         >
//           <ProFormText name="username" label="Username" rules={[{ required: true }]} />
//           <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
//           <ProFormText name="password" label="Password" rules={[{ required: false }]} />
//           <ProFormSelect
//             name="permission"
//             label="Allowed Tabs"
//             options={availableTabs}
//             mode="multiple"
//             rules={[{ required: true }]}
//           />
//         </ModalForm>
//       )}
//     </PageContainer>
//   );
// };
//
// export default UserManagement;
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
  password: string | null;
  permission: string | null; // Store as "USER_TYPEX"
}

// Available pages mapped to binary bit positions
const availableTabs = [
  { label: 'p1', value: 1 << 0 }, // Binary 0001 (1)
  { label: 'p2', value: 1 << 1 }, // Binary 0010 (2)
  { label: 'p3', value: 1 << 2 }, // Binary 0100 (4)
  { label: 'p4', value: 1 << 3 }, // Binary 1000 (8)
];

// Extract the decimal number from "USER_TYPEX"
const extractPermissionValue = (permission: string | null): number => {
  if (!permission) return 0;
  const match = permission.match(/USER_TYPE(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Get allowed pages based on extracted decimal permission
const getAllowedPages = (permission: string | null) => {
  const decimalPermission = extractPermissionValue(permission);
  if (!decimalPermission) return 'No Access';

  return availableTabs
    .filter((tab) => (decimalPermission & tab.value) !== 0)
    .map((tab) => tab.label)
    .join(', ');
};

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
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Password', dataIndex: 'password', key: 'password' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string | null) => email || 'N/A' },
    { title: 'Permission', dataIndex: 'permission', key: 'permission' },
    {
      title: 'Allowed Tabs',
      dataIndex: 'permission',
      key: 'allowedTabs',
      render: (permission: string | null) => getAllowedPages(permission),
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
            // Convert selected permissions to a decimal number
            const decimalPermission = Array.isArray(values.permission)
              ? values.permission.reduce((acc: number, val: number) => acc | val, 0)
              : 0;
            const permissionString = `USER_TYPE${decimalPermission}`;

            const newUser = await addUser({ ...values, permission: permissionString });

            if (newUser) {
              message.success("✅ User added successfully!");
              setUsers([...users, newUser]);
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
        <ProFormText name="username" label="Username" rules={[{ required: false }]} />
        <ProFormText name="email" label="Email" rules={[{ required: false, type: 'email' }]} />
        <ProFormText name="password" label="Password" rules={[{ required: false }]} />
        <ProFormSelect
          name="permission"
          label="Allowed Tabs"
          options={availableTabs}
          mode="multiple" // Allows selecting multiple pages
          rules={[{ required: true }]}
        />
      </ModalForm>

      {/* Edit User Modal */}
      {selectedUser && (
        <ModalForm<User>
          title="Edit User"
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialValues={{
            ...selectedUser,
            permission: availableTabs
              .filter((tab) => (extractPermissionValue(selectedUser.permission) & tab.value) !== 0)
              .map((tab) => tab.value),
          }}
          onFinish={async (values) => {

            const decimalPermission = Array.isArray(values.permission)
              ? values.permission.reduce((acc: number, val: number) => acc | val, 0)
              : 0;
            const permissionString = `USER_TYPE${decimalPermission}`;

            const success = await updateUser(selectedUser.id, { ...values, permission: permissionString });

            if (success) {
              setEditModalOpen(false);
              message.success("✅ Updated successfully!");
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === selectedUser.id ? { ...user, ...values, permission: permissionString } : user
                )
              );
            }
          }}
        >
          <ProFormText name="username" label="Username" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
          <ProFormText name="password" label="Password" rules={[{ required: false }]} />
          <ProFormSelect
            name="permission"
            label="Allowed Tabs"
            options={availableTabs}
            mode="multiple"
            rules={[{ required: true }]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default UserManagement;

/**
 * @see https://umijs.org/docs/max/access#access
 * */
// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const { currentUser } = initialState ?? {};
//   // @ts-ignore
//   const role = currentUser.roles[0].authority;
//   return {
//     // @ts-ignore
//     canAdmin: currentUser && role === 'ROLE_ADMIN',
//     // @ts-ignore
//     canUser: currentUser && (role === 'ROLE_ADMIN'|| role === 'ROLE_USER' || role === 'ROLE_USER_TYPE1'),
//     canPage1: currentUser && (role === 'ROLE_ADMIN' || role ==='USER_TYPE1'),
//   };
// }
// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const { currentUser } = initialState ?? {};
//   // @ts-ignore
//   const role = currentUser?.roles?.[0]?.authority;
//
//   let binaryPermission = '';
//   let canPage1 = false;
//   let canPage2 = false;
//   let canPage3 = false;
//   let canPage4 = false;
//   if (role) {
//     // Extract the number from roles like "ROLE_USER_TYPEX"
//     const match = role.match(/(?:ROLE_)?USER_TYPE(\d+)/);
//     if (match) {
//       const num = parseInt(match[1], 10);
//       binaryPermission = num.toString(2).padStart(4, '0'); // Ensure at least 2 digits
//
//       // Check the first and second digits from the left
//       canPage1 = binaryPermission.length > 0 && binaryPermission[binaryPermission.length - 1] === '1';
//       canPage2 = binaryPermission.length > 1 && binaryPermission[binaryPermission.length - 2] === '1';
//       canPage3 = binaryPermission.length > 2 && binaryPermission[binaryPermission.length - 3] === '1';
//       canPage4 = binaryPermission.length > 3 && binaryPermission[binaryPermission.length - 4] === '1';
//     }
//   }
//
//   return {
//     canAdmin: currentUser && role === 'ROLE_ADMIN',
//     canUser: currentUser && (role === 'ROLE_ADMIN' || role === 'ROLE_USER' || role.startsWith('ROLE_USER_TYPE')),
//     canPage1: canPage1 || role === 'ROLE_ADMIN',
//     canPage2: canPage2 || role === 'ROLE_ADMIN',
//     canPage3: canPage3 || role === 'ROLE_ADMIN',
//     canPage4: canPage4 || role === 'ROLE_ADMIN',
//
//     binaryPermission, // Useful for debugging
//   };
// }
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  // @ts-ignore
  const role = currentUser?.roles?.[0]?.authority;

  let binaryPermission = '0000'; // Default to 4-bit binary (no access)
  const pagePermissions: Record<string, boolean> = {};

  if (role) {
    // Extract the number from roles like "ROLE_USER_TYPEX"
    const match = role.match(/(?:ROLE_)?USER_TYPE(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      binaryPermission = num.toString(2).padStart(4, '0'); // Ensure at least 4 digits

      // Dynamically set canPageX values based on binary bits
      for (let i = 0; i < binaryPermission.length; i++) {
        if (binaryPermission[binaryPermission.length - 1 - i] === '1') {
          pagePermissions[`canPage${i + 1}`] = true;
        }
      }
    }
  }

  return {
    canAdmin: currentUser && role === 'ROLE_ADMIN',
    canUser: currentUser && (role === 'ROLE_ADMIN' || role === 'ROLE_USER' || role.startsWith('ROLE_USER_TYPE')),
    ...Array.from({ length: 4 }, (_, i) => `canPage${i + 1}`).reduce((acc, key) => {
      acc[key] = pagePermissions[key] || role === 'ROLE_ADMIN';
      return acc;
    }, {} as Record<string, boolean>),

    binaryPermission, // Useful for debugging
  };
}



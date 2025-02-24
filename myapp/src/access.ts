/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {

    canAdmin: currentUser && currentUser.roles[0].authority === 'ROLE_ADMIN',
    canUser: currentUser && (currentUser.roles[0].authority === 'ROLE_ADMIN'|| currentUser.roles[0].authority === 'ROLE_USER'),
  };
}
import { useAuth } from '@/context/AuthContext';

// export default function access(initialState: { user?: any }) {
//   const { user } = initialState || {};
//
//   return {
//     canAdmin: user?.role === 'Admin',
//     canAccess: (routePath: string) => user?.allowedTabs?.includes(routePath) ?? false,
//   };
// }

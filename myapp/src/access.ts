/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    // @ts-ignore
    canAdmin: currentUser && currentUser.roles[0].authority === 'ROLE_ADMIN',
    // @ts-ignore
    canUser: currentUser && (currentUser.roles[0].authority === 'ROLE_ADMIN'|| currentUser.roles[0].authority === 'ROLE_USER'),
  };
}


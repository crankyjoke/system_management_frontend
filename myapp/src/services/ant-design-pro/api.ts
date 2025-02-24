// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { history } from '@umijs/max';
import {message} from "antd";
/** 获取当前的用户 GET /api/currentUser */
// export async function currentUser(options?: { [key: string]: any }) {
//   return request<{
//     data: API.CurrentUser;
//   }>('/api/currentUser', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }


// export async function currentUser(options?: { [key: string]: any }) {
//   return request<API.CurrentUser>('http://localhost:8080/api/currentUser', {
//     method: 'GET',
//     withCredentials: true, // ✅ Ensures session-based authentication
//     ...(options || {}),
//   }).catch(error => {
//     console.error("❌ Failed to fetch user:", error);
//   });
// }
export async function currentUser(options?: { [key: string]: any }) {
  try {
    const response = await request<API.CurrentUser>('http://localhost:8080/api/currentUser', {
      method: 'GET',
      withCredentials: true, // ✅ Ensures session-based authentication
      ...(options || {}),
    });
    // const authority = response.roles[0].authority;
    // console.log(authority); // Output: "ROLE_ADMIN"
    //
    //
    // console.log("📡 API Response:", response.roles);
    // console.log("🔑 User Permission:", response?.authority);

    return response;
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    return undefined;
  }
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}


/** 登录接口 POST /api/login/account */

// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   console.log("🔍 Sending login request:", body);
//
//   try {
//     const response = await request<API.LoginResult>('http://localhost:8080/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: `username=${encodeURIComponent(body.username ?? '')}&password=${encodeURIComponent(body.password ?? '')}`,
//       withCredentials: true, // ✅ Ensures session is saved
//       ...(options || {}),
//     });
//
//     if (response && response.status === 'ok') {
//       message.success("🎉 Login successful!");
//       history.push('/welcome); // ✅ Redirect to dashboard
//     } else {
//       message.error(`❌ Login failed: ${response.message}`);
//     }
//
//     return response;
//   } catch (error) {
//     console.error("❌ Login request failed:", error);
//     message.error("❌ An error occurred while logging in.");
//     throw error;
//   }
// }
export async function login(body: API.LoginParams) {
  try {
    console.log("🔍 Sending login request:", body);

    const response = await request<API.LoginResult>('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: new URLSearchParams({
        username: body.username ?? '',
        password: body.password ?? '',
        permission: body.permission ?? '',
      }).toString(),
      withCredentials: true, // ✅ Ensures session authentication
    });

    console.log("✅ Login successful:", response);

    return response;
  } catch (error) {
    console.error("❌ Login request failed:", error);
    throw error;
  }
}


/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

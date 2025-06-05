import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // Stories
  ALL_STORIES: `${BASE_URL}/login`,
  STORIES_DETAIL: `${BASE_URL}/login`,
  CREATE_STORY: `${BASE_URL}/stories`,
  CREATE_STORY_GUEST: `${BASE_URL}/stories/guest`,

  // Report Comment
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// delete
export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// ======================================

export const addStory = async (rawFormData, token) => {
  try {
    const formData = new FormData();
    const isAnonymous = rawFormData.get('is_anonymous') === 'true';

    for (const [key, value] of rawFormData.entries()) {
      if (key !== 'is_anonymous') {
        formData.append(key, value);
      }
    }
    let endpoint;
    const headers = {};

    if (isAnonymous) {
      endpoint = ENDPOINTS.CREATE_STORY_GUEST;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
      endpoint = ENDPOINTS.CREATE_STORY;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    return await response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const getStories = async (page, size, withLocation, accessToken) => {
  console.log(page, size, withLocation);

  const response = await fetch(
    `${BASE_URL}/stories?page=${page}&size=${size}&location=${withLocation ? 1 : 0}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.json();
};

export const getStoryDetail = async (id) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

// ======================================

// export async function getAllReports() {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.REPORT_LIST, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

// export async function getReportById(id) {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.REPORT_DETAIL(id), {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

// export async function storeNewReport({
//   title,
//   damageLevel,
//   description,
//   evidenceImages,
//   latitude,
//   longitude,
// }) {
//   const accessToken = getAccessToken();

//   const formData = new FormData();
//   formData.set('title', title);
//   formData.set('damageLevel', damageLevel);
//   formData.set('description', description);
//   formData.set('latitude', latitude);
//   formData.set('longitude', longitude);
//   evidenceImages.forEach((evidenceImage) => {
//     formData.append('evidenceImages', evidenceImage);
//   });

//   const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_REPORT, {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${accessToken}` },
//     body: formData,
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

// export async function getAllCommentsByReportId(reportId) {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.REPORT_COMMENTS_LIST(reportId), {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

// export async function storeNewCommentByReportId(reportId, { body }) {
//   const accessToken = getAccessToken();
//   const data = JSON.stringify({ body });

//   const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_REPORT_COMMENT(reportId), {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`,
//     },
//     body: data,
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
  });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendReportToMeViaNotification(reportId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_ME(reportId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendReportToUserViaNotification(reportId, { userId }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    userId,
  });

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_USER(reportId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendReportToAllUserViaNotification(reportId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_ALL_USER(reportId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendCommentToReportOwnerViaNotification(reportId, commentId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SEND_COMMENT_TO_REPORT_OWNER(reportId, commentId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

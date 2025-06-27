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
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok
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
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData
    });

    return await response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const getStories = async (page, size, withLocation, accessToken) => {
  const response = await fetch(
    `${BASE_URL}/stories?page=${page}&size=${size}&location=${withLocation ? 1 : 0}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return response.json();
};

export const getStoryDetail = async (id) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.json();
};

export const requesNotification = async (payload) => {
  const accessToken = getAccessToken();

  const payloadJson = JSON.stringify({
    endpoint: payload.endpoint,
    //keys: payload.keys,
    keys: payload.toJSON().keys
  });
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: payloadJson
  });

  return response.json();
};
export const unsubcribeNotification = async (payload) => {
  const accessToken = getAccessToken();

  const payloadJson = JSON.stringify({
    endpoint: payload.endpoint
    //keys: payload.toJSON().keys,
  });
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: payloadJson
  });

  return response.json();
};

export async function fetchImageAsBlob(url) {
  try {
    const response = await fetch(url);
    return await response.blob();
  } catch (err) {
    console.error('Failed to fetch image as blob:', err);
    return null;
  }
}

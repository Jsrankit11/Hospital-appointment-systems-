import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hams_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Vercel Demo Fix: Local Persistence Interceptor
API.interceptors.response.use((response) => {
  const { url, method } = response.config;
  if (!url) return response;

  try {
    // 1. Password / Registration Saving
    if (method === 'post' && url.includes('/auth/register')) {
      const localUsers = JSON.parse(localStorage.getItem('hams_local_users') || '[]');
      if (response.data.success && response.data.user) {
        const exists = localUsers.findIndex((u: any) => u.email === response.data.user.email);
        if (exists === -1) {
          const reqData = JSON.parse(response.config.data);
          localUsers.unshift({ ...response.data.user, passwordPreview: reqData.password });
          localStorage.setItem('hams_local_users', JSON.stringify(localUsers));
        }
      }
    }

    if (method === 'post' && url.includes('/auth/reset-password')) {
      const reqData = JSON.parse(response.config.data);
      const localUsers = JSON.parse(localStorage.getItem('hams_local_users') || '[]');
      const userIndex = localUsers.findIndex((u: any) => u.email === reqData.identifier || u.mobile === reqData.identifier);
      if (userIndex > -1) {
        localUsers[userIndex].passwordPreview = reqData.newPassword;
        localStorage.setItem('hams_local_users', JSON.stringify(localUsers));
      } else {
        localUsers.unshift({
           id: `USR-${Date.now().toString().slice(-4)}`,
           email: reqData.identifier,
           passwordPreview: reqData.newPassword,
           role: 'PATIENT',
           name: 'Citizen (Recovered)'
        });
        localStorage.setItem('hams_local_users', JSON.stringify(localUsers));
      }
    }

    // 2. Admin Users Merge
    if (method === 'get' && url.includes('/admin/users')) {
      const localUsers = JSON.parse(localStorage.getItem('hams_local_users') || '[]');
      if (response.data.success && Array.isArray(response.data.data)) {
         const serverUsers = response.data.data;
         const merged = [...localUsers];
         serverUsers.forEach((su: any) => {
           if (!merged.find(mu => mu.email === su.email)) {
             merged.push(su);
           }
         });
         response.data.data = merged;
         response.data.count = merged.length;
      }
    }

    // 3. Appointments Saving
    if (method === 'post' && url.includes('/ors/book')) {
       if (response.data.success && response.data.appointment) {
          const localApts = JSON.parse(localStorage.getItem('hams_local_appointments') || '[]');
          localApts.unshift(response.data.appointment);
          localStorage.setItem('hams_local_appointments', JSON.stringify(localApts));
       }
    }

    // Update Analytics to show local appointments if needed
    if (method === 'get' && url.includes('/analytics')) {
       const localApts = JSON.parse(localStorage.getItem('hams_local_appointments') || '[]');
       if (response.data.success && response.data.stats && localApts.length > 0) {
          response.data.stats.totalOPD += localApts.length;
          response.data.stats.waitingOPD += localApts.length;
       }
    }

  } catch (e) {
    console.warn('Local Interceptor Error:', e);
  }

  return response;
}, (error) => {
  return Promise.reject(error);
});

export default API;

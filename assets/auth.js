/**
 * auth.js — Client-side auth API for veldra.org.
 *
 * Talks directly to auth.veldra.org (CORS enabled for veldra.org).
 * Stores session token in localStorage. Provides login, register,
 * verify, forgot-password, and reset-password flows.
 */
(function () {
  'use strict';

  var AUTH_BASE = 'https://auth.veldra.org';
  var TOKEN_KEY = 'veldra_auth_token';
  var USER_KEY  = 'veldra_auth_user';

  /* ── Token helpers ── */

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (_) { return null; }
  }

  function setToken(t) {
    try { localStorage.setItem(TOKEN_KEY, t); } catch (_) { /* noop */ }
  }

  function getUser() {
    try {
      var raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function setUser(u) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch (_) { /* noop */ }
  }

  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (_) { /* noop */ }
  }

  /* ── HTTP helpers ── */

  function postJson(path, body) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    return fetch(AUTH_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    }).then(function (resp) {
      clearTimeout(timer);
      return resp.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (_) { /* text body */ }
        return { status: resp.status, ok: resp.ok, body: json, text: text };
      });
    }).catch(function () {
      clearTimeout(timer);
      return { status: 0, ok: false, body: null, text: 'Network error' };
    });
  }

  function getJson(path) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    return fetch(AUTH_BASE + path, {
      signal: ctrl.signal,
    }).then(function (resp) {
      clearTimeout(timer);
      return resp.text().then(function (text) {
        return { status: resp.status, ok: resp.ok, text: text };
      });
    }).catch(function () {
      clearTimeout(timer);
      return { status: 0, ok: false, text: 'Network error' };
    });
  }

  /* ── Public API ── */

  window.VeldraAuth = {
    getToken: getToken,
    getUser: getUser,
    clearSession: clearSession,

    /** POST /auth/login → { token, user } */
    login: function (email, password) {
      return postJson('/auth/login', { email: email, password: password }).then(function (r) {
        if (r.ok && r.body && r.body.token) {
          setToken(r.body.token);
          setUser(r.body.user || { email: email });
          return { ok: true, user: r.body.user };
        }
        var code = r.body ? r.body.code : null;
        var detail = r.body ? (r.body.detail || r.body.error || r.body.message) : null;
        if (code === 'email_not_verified') return { ok: false, error: 'Please verify your email first.' };
        if (code === 'pending_approval')  return { ok: false, error: 'Your account is pending admin approval.' };
        if (code === 'access_denied')     return { ok: false, error: 'Your access request was denied.' };
        return { ok: false, error: detail || 'Login failed (' + r.status + ')' };
      });
    },

    /** POST /auth/logout */
    logout: function () {
      var token = getToken();
      clearSession();
      if (!token) return Promise.resolve();
      return fetch(AUTH_BASE + '/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
      }).catch(function () { /* best effort */ });
    },

    /** POST /auth/register → { ok, message } */
    register: function (email, name, org, password) {
      return postJson('/auth/register', {
        email: email, name: name, org: org, password: password,
      }).then(function (r) {
        if (r.ok && r.body && r.body.ok) return { ok: true, message: r.body.message || 'Check your email to verify.' };
        var detail = r.body ? (r.body.detail || r.body.error) : null;
        return { ok: false, error: detail || 'Registration failed (' + r.status + ')' };
      });
    },

    /** GET /auth/verify?token=... → plain text */
    verifyEmail: function (token) {
      return getJson('/auth/verify?token=' + encodeURIComponent(token)).then(function (r) {
        if (r.ok) return { ok: true, message: r.text || 'Email verified.' };
        return { ok: false, message: r.text || 'Verification failed.' };
      });
    },

    /** POST /auth/forgot-password → { ok, message } */
    forgotPassword: function (email) {
      return postJson('/auth/forgot-password', { email: email }).then(function (r) {
        if (r.ok && r.body && r.body.ok) return { ok: true, message: r.body.message || 'Check your email for a reset link.' };
        var detail = r.body ? (r.body.detail || r.body.message) : null;
        return { ok: false, message: detail || 'Request failed.' };
      });
    },

    /** POST /auth/reset-password → { ok, message } */
    resetPassword: function (token, password) {
      return postJson('/auth/reset-password', { token: token, password: password }).then(function (r) {
        if (r.ok && r.body && r.body.ok) return { ok: true, message: r.body.message || 'Password reset successful.' };
        var detail = r.body ? (r.body.detail || r.body.message) : null;
        return { ok: false, message: detail || 'Reset failed.' };
      });
    },
  };
})();

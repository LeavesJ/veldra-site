/**
 * auth.js — Client-side auth API for veldra.org.
 *
 * Talks to rg-auth (CORS enabled for veldra.org). Stores session token in
 * localStorage. Provides login, register, verify, forgot-password,
 * reset-password, and account session flows.
 *
 * AUTH_BASE override: pages can set window.AUTH_BASE before loading this
 * script to point at a local rg-auth (for example
 * window.AUTH_BASE = 'http://localhost:8080' during dev). Default is the
 * production subdomain auth.veldra.org.
 */
(function () {
  'use strict';

  // AUTH_BASE resolution order:
  //   1. Explicit window.AUTH_BASE wins (any page can override before this script loads).
  //   2. Localhost or 127.0.0.1 or [::1] hosts auto-default to http://localhost:8080
  //      so local previews never accidentally hit production rg-auth.
  //   3. Everything else uses production at https://auth.veldra.org.
  function resolveAuthBase() {
    if (typeof window === 'undefined') return 'https://auth.veldra.org';
    if (window.AUTH_BASE) return window.AUTH_BASE;
    var h = window.location && window.location.hostname ? window.location.hostname : '';
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0') {
      return 'http://localhost:8080';
    }
    return 'https://auth.veldra.org';
  }
  var AUTH_BASE = resolveAuthBase();
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

  function getAuthJson(path) {
    var token = getToken();
    if (!token) return Promise.resolve({ status: 401, ok: false, body: null, text: 'No token' });
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    return fetch(AUTH_BASE + path, {
      headers: { 'Authorization': 'Bearer ' + token },
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

  function postAuthJson(path, body) {
    var token = getToken();
    if (!token) return Promise.resolve({ status: 401, ok: false, body: null, text: 'No token' });
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    return fetch(AUTH_BASE + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
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
        var code = r.body ? (r.body.error || r.body.code) : null;
        var detail = r.body ? (r.body.detail || r.body.message) : null;
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

    /** GET /auth/verify?token=... → plain text or JSON {detail, error} */
    verifyEmail: function (token) {
      return getJson('/auth/verify?token=' + encodeURIComponent(token)).then(function (r) {
        // rg-auth returns plain text on success, JSON {detail, error} on
        // failure. Parse JSON if it looks like an object so the page renders
        // a friendly message instead of the raw envelope.
        var friendly = r.text;
        if (friendly && friendly.charAt(0) === '{') {
          try {
            var parsed = JSON.parse(friendly);
            friendly = parsed.detail || parsed.message || parsed.error || friendly;
          } catch (_) { /* keep raw text */ }
        }
        if (r.ok) return { ok: true, message: friendly || 'Email verified.' };
        return { ok: false, message: friendly || 'Verification failed.' };
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

    /** GET /auth/session → { valid, user: { id, name, email, org, tier } } */
    sessionCheck: function () {
      return getAuthJson('/auth/session').then(function (r) {
        if (r.ok && r.body && r.body.valid) {
          setUser(r.body.user);
          return { ok: true, user: r.body.user };
        }
        clearSession();
        return { ok: false };
      });
    },

    /** GET /auth/keys → { keys: [{ id, key_prefix, label, status, created_at, revoked_at }] } */
    listKeys: function () {
      return getAuthJson('/auth/keys').then(function (r) {
        if (r.ok && r.body && r.body.keys) return { ok: true, keys: r.body.keys };
        return { ok: false, error: (r.body && r.body.detail) || 'Failed to load keys' };
      });
    },

    /** POST /auth/keys/generate → { ok, key: { id, key_value, label, status } } */
    generateKey: function (label) {
      return postAuthJson('/auth/keys/generate', { label: label || '' }).then(function (r) {
        if (r.ok && r.body && r.body.ok) return { ok: true, key: r.body.key };
        var detail = r.body ? (r.body.detail || r.body.error) : null;
        return { ok: false, error: detail || 'Failed to generate key' };
      });
    },

    /** POST /auth/keys/revoke → { ok } */
    revokeKey: function (keyId) {
      return postAuthJson('/auth/keys/revoke', { key_id: keyId }).then(function (r) {
        if (r.ok && r.body && r.body.ok) return { ok: true };
        var detail = r.body ? (r.body.detail || r.body.error) : null;
        return { ok: false, error: detail || 'Failed to revoke key' };
      });
    },
  };
})();

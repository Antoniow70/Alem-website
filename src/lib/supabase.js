import { createClient } from '@supabase/supabase-js';
import { MOCK_PROJECTS, MOCK_VOLUNTEERS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as credenciais do Supabase foram configuradas e nao sao os valores padrao
const hasValidCredentials = 
  supabaseUrl && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-anon-key' && 
  supabaseAnonKey.trim() !== '';

export const isMock = !hasValidCredentials;

// ─── Persistent localStorage helpers ────────────────────────────────────────
const STORAGE_KEYS = {
  projects: 'alem_projects_db',
  volunteers: 'alem_volunteers_db',
  messages: 'alem_messages_db',
  donations: 'alem_donations_db',
  beneficiary_stories: 'alem_beneficiary_stories_db',
  team: 'alem_team_db',
  partners: 'alem_partners_db',
};

function getTable(table) {
  const key = STORAGE_KEYS[table];
  if (!key) return [];
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  // Seed with mock data on first load
  if (table === 'projects') {
    localStorage.setItem(key, JSON.stringify(MOCK_PROJECTS));
    return MOCK_PROJECTS;
  }
  if (table === 'volunteers') {
    localStorage.setItem(key, JSON.stringify(MOCK_VOLUNTEERS));
    return MOCK_VOLUNTEERS;
  }
  return [];
}

function saveTable(table, data) {
  const key = STORAGE_KEYS[table];
  if (key) localStorage.setItem(key, JSON.stringify(data));
}

// ─── IndexedDB helpers for large file storage (videos, images) ──────────────
const DB_NAME = 'alem_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const IDB_PREFIX = 'idb://';

// Cache of path → blob URL (valid for current page session)
const _blobUrlCache = {};

function openMediaDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Load a file from IndexedDB and return a blob URL
async function loadBlobUrl(path) {
  if (_blobUrlCache[path]) return _blobUrlCache[path];
  try {
    const db = await openMediaDB();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(path);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (record && record.blob) {
      const blobUrl = URL.createObjectURL(record.blob);
      _blobUrlCache[path] = blobUrl;
      return blobUrl;
    }
  } catch (err) {
    console.error('Error loading blob from IndexedDB:', err);
  }
  return null;
}

/**
 * Resolve a media URL: if it starts with "idb://", load the blob from IndexedDB.
 * Otherwise return the URL as-is (YouTube links, external URLs, etc.)
 */
export async function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith(IDB_PREFIX)) {
    const path = url.slice(IDB_PREFIX.length);
    const blobUrl = await loadBlobUrl(path);
    return blobUrl || 'https://picsum.photos/seed/alem/800/600';
  }
  return url;
}

/**
 * Resolve all media URLs in an array of projects (media_url + gallery items).
 * Call this after fetching projects to ensure all idb:// URLs become blob:// URLs.
 */
export async function resolveProjectMediaUrls(projects) {
  return Promise.all(projects.map(async (p) => {
    const resolved = { ...p };
    resolved._original_media_url = p.media_url;
    resolved._original_capa_url = p.capa_url;
    resolved.media_url = await resolveMediaUrl(p.media_url);
    resolved.capa_url = await resolveMediaUrl(p.capa_url);
    if (p.gallery && p.gallery.length > 0) {
      resolved.gallery = await Promise.all(p.gallery.map(async (item) => ({
        ...item,
        _original_url: item.url,
        url: await resolveMediaUrl(item.url),
      })));
    }
    return resolved;
  }));
}

// ─── Mock Supabase client ────────────────────────────────────────────────────
const mockClient = {
  from: (table) => {
    let _filters = [];
    let _orderField = null;
    let _orderAsc = true;

    const chain = {
      select: () => chain,

      order: (field, opts) => {
        _orderField = field;
        _orderAsc = opts?.ascending !== false;
        return chain;
      },

      limit: () => chain,

      eq: (field, value) => {
        _filters.push({ field, value });
        return chain;
      },

      // INSERT
      insert: (rows) => {
        const data = getTable(table);
        const newRows = (Array.isArray(rows) ? rows : [rows]).map(row => ({
          ...row,
          id: row.id || Date.now().toString() + Math.random().toString(36).slice(2),
          created_at: row.created_at || new Date().toISOString(),
        }));
        saveTable(table, [...data, ...newRows]);
        return Promise.resolve({ data: newRows, error: null });
      },

      // UPDATE – applies eq() filters
      update: (patch) => {
        const applyUpdate = () => {
          const data = getTable(table);
          const updated = data.map(row => {
            const match = _filters.every(f => String(row[f.field]) === String(f.value));
            return match ? { ...row, ...patch } : row;
          });
          saveTable(table, updated);
          return Promise.resolve({ data: updated, error: null });
        };
        const updateChain = {
          eq: (field, value) => {
            _filters.push({ field, value });
            return applyUpdate();
          },
          then: (resolve) => applyUpdate().then(resolve),
        };
        return updateChain;
      },

      // DELETE – applies eq() filters
      delete: () => {
        const applyDelete = () => {
          const data = getTable(table);
          const filtered = data.filter(row =>
            !_filters.every(f => String(row[f.field]) === String(f.value))
          );
          saveTable(table, filtered);
          return Promise.resolve({ data: filtered, error: null });
        };
        const deleteChain = {
          eq: (field, value) => {
            _filters.push({ field, value });
            return applyDelete();
          },
          then: (resolve) => applyDelete().then(resolve),
        };
        return deleteChain;
      },

      // Thenable – resolves SELECT with filtered + sorted data
      then: (resolve) => {
        let data = getTable(table);
        if (_filters.length > 0) {
          data = data.filter(row =>
            _filters.every(f => String(row[f.field]) === String(f.value))
          );
        }
        if (_orderField) {
          data = [...data].sort((a, b) => {
            const va = a[_orderField] ?? '';
            const vb = b[_orderField] ?? '';
            return _orderAsc
              ? String(va).localeCompare(String(vb))
              : String(vb).localeCompare(String(va));
          });
        }
        resolve({ data, error: null });
      },
    };

    return chain;
  },

  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: ({ email, password }) => {
      if (email === 'admin@alem.mz' && password === 'admin123') {
        return Promise.resolve({ data: { user: { id: '1' }, session: { access_token: 'mock' } }, error: null });
      }
      return Promise.resolve({ data: { user: null, session: null }, error: new Error('Invalid credentials') });
    },
    signOut: () => Promise.resolve({ error: null }),
  },

  storage: {
    from: (bucket) => ({
      /**
       * Upload: stores file as Blob in IndexedDB (no size limit).
       * Returns the path for later retrieval.
       */
      upload: async (path, file) => {
        try {
          const db = await openMediaDB();
          const blob = new Blob([file], { type: file.type });
          await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put({ path, blob, type: file.type });
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
          });
          // Cache a blob URL immediately for same-session use
          _blobUrlCache[path] = URL.createObjectURL(blob);
          return { data: { path }, error: null };
        } catch (err) {
          console.error('Upload error:', err);
          return { data: null, error: err };
        }
      },

      /**
       * getPublicUrl: Returns an idb:// marker URL for persistence.
       * The marker is resolved to a real blob:// URL by resolveMediaUrl().
       */
      getPublicUrl: (path) => {
        return { data: { publicUrl: `${IDB_PREFIX}${path}` } };
      },
    }),
  },
};

export const supabase = isMock ? mockClient : createClient(supabaseUrl, supabaseAnonKey);

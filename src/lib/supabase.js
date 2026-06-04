import { MOCK_PROJECTS, MOCK_VOLUNTEERS } from './mockData';

export const isMock = true;

// Mock client implementation for pure React project without Supabase
const mockClient = {
  from: (table) => {
    const chain = {
      select: () => chain,
      order: () => chain,
      limit: () => chain,
      eq: () => chain,
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => chain,
      delete: () => chain,
      then: (resolve) => {
        let data = [];
        if (table === 'projects') data = MOCK_PROJECTS;
        else if (table === 'volunteers') data = MOCK_VOLUNTEERS;
        else if (table === 'messages') data = [];
        resolve({ data, error: null });
      }
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
      upload: (path, file) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: 'https://picsum.photos/seed/alem/800/600' } }),
    }),
  }
};

export const supabase = mockClient;

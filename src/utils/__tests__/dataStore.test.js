// src/utils/__tests__/dataStore.test.js
import { describe, it, expect, vi } from 'vitest';
import DataStore from '../dataStore';
import { FirestoreDataStore } from '../storage';
import { LocalStorageDataStore } from '../localStorage';

// Mock the storage modules
vi.mock('../storage.js', () => ({
  FirestoreDataStore: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

vi.mock('../localStorage.js', () => ({
  LocalStorageDataStore: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

describe('DataStore', () => {
  it('should use LocalStorageDataStore by default', async () => {
    await DataStore.load('some_key');
    expect(LocalStorageDataStore.load).toHaveBeenCalledWith('some_key');
  });

  it('should switch to FirestoreDataStore when setStorageEngine is called with "firebase"', async () => {
    DataStore.setStorageEngine('firebase');
    await DataStore.save('another_key', { data: 'test' });
    expect(FirestoreDataStore.save).toHaveBeenCalledWith('another_key', { data: 'test' });
  });
});
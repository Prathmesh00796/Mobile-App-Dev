import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  isCompleted?: boolean;
}

const STORAGE_KEY = 'notes';

interface NotesScreenProps {
  onBackToLab?: () => void;
}

const NotesScreen: React.FC<NotesScreenProps> = ({ onBackToLab }) => {
  // Step 57: notes state array using useState
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageStatus, setStorageStatus] = useState<string>('Ready');

  // Step 59: Use useEffect on mount to call AsyncStorage.getItem('notes')
  useEffect(() => {
    loadNotes();
  }, []);

  // READ Operation: Retrieve and parse notes from AsyncStorage
  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const storedNotesJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotesJson !== null) {
        const parsedNotes: Note[] = JSON.parse(storedNotesJson);
        setNotes(parsedNotes);
        setStorageStatus(`Loaded ${parsedNotes.length} notes from storage`);
      } else {
        setNotes([]);
        setStorageStatus('Storage initialized (empty)');
      }
    } catch (error) {
      console.error('Error loading notes from AsyncStorage:', error);
      Alert.alert('Storage Error', 'Failed to read notes from local device storage.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 57: saveNotes(updatedNotes) that calls AsyncStorage.setItem('notes', JSON.stringify(...))
  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      const jsonValue = JSON.stringify(updatedNotes);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setStorageStatus(`Persisted ${updatedNotes.length} notes (${jsonValue.length} bytes)`);
    } catch (error) {
      console.error('Error saving notes to AsyncStorage:', error);
      Alert.alert('Storage Error', 'Failed to persist notes to AsyncStorage.');
    }
  };

  // Step 58: CREATE Operation - addNote()
  const addNote = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      Alert.alert('Validation Error', 'Note content cannot be empty.');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(), // Unique ID generated via Date.now()
      text: trimmed,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: false,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setInputText('');
    Keyboard.dismiss();
    await saveNotes(updatedNotes);
  };

  // Step 61: UPDATE Operation - updateNote(id, newText)
  const updateNote = async (id: string, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      Alert.alert('Validation Error', 'Note content cannot be empty.');
      return;
    }

    const updatedNotes = notes.map((item) =>
      item.id === id ? { ...item, text: trimmed } : item
    );

    setNotes(updatedNotes);
    setEditingId(null);
    setInputText('');
    Keyboard.dismiss();
    await saveNotes(updatedNotes);
  };

  // Step 62: DELETE Operation - deleteNote(id)
  const deleteNote = async (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note from local storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter((item) => item.id !== id);
            setNotes(updatedNotes);
            if (editingId === id) {
              setEditingId(null);
              setInputText('');
            }
            await saveNotes(updatedNotes);
          },
        },
      ]
    );
  };

  // Toggle completion status
  const toggleComplete = async (id: string) => {
    const updatedNotes = notes.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  // Start editing a note
  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setInputText(note.text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setInputText('');
    Keyboard.dismiss();
  };

  // Clear all notes helper
  const handleClearAll = () => {
    if (notes.length === 0) return;
    Alert.alert(
      'Clear All Notes',
      'This will remove all items from local AsyncStorage permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setNotes([]);
            setEditingId(null);
            setInputText('');
            setStorageStatus('Storage cleared');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {onBackToLab && (
            <TouchableOpacity style={styles.backBtn} onPress={onBackToLab}>
              <Text style={styles.backBtnText}>‹ Lab Home</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerBadge}>CO4 • EXPERIMENT 08</Text>
            <Text style={styles.headerTitle}>AsyncStorage CRUD App</Text>
          </View>
        </View>
      </View>

      {/* Storage Architecture Info Banner */}
      <View style={styles.storageBanner}>
        <View style={styles.storageStatusRow}>
          <Text style={styles.storageTag}>AsyncStorage: key = '{STORAGE_KEY}'</Text>
          <Text style={styles.statusIndicator}>● Active</Text>
        </View>
        <Text style={styles.statusDetailText}>{storageStatus}</Text>
      </View>

      {/* Step 56: TextInput for entering a new note & Add Note button */}
      <View style={styles.inputCard}>
        <Text style={styles.inputCardLabel}>
          {editingId ? '✏️ Edit Selected Note:' : '📝 Create New Note:'}
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={editingId ? 'Update note text...' : 'Enter note or task description...'}
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        <View style={styles.buttonActionRow}>
          {editingId ? (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, styles.updateBtn]}
                activeOpacity={0.8}
                onPress={() => updateNote(editingId, inputText)}
              >
                <Text style={styles.actionBtnText}>✓ Update Note</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                activeOpacity={0.8}
                onPress={cancelEditing}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, styles.addBtn]}
              activeOpacity={0.8}
              onPress={addNote}
            >
              <Text style={styles.actionBtnText}>+ Add Note</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notes List Statistics Header */}
      <View style={styles.statsBar}>
        <Text style={styles.statsTitle}>
          Saved Notes ({notes.length})
        </Text>
        {notes.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Step 60: Render the notes using FlatList */}
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Reading from AsyncStorage...</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No Notes Stored Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first note above. It will be serialized with JSON.stringify() and saved permanently to AsyncStorage!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.noteCard, item.isCompleted && styles.noteCardCompleted]}>
              <View style={styles.noteMainRow}>
                {/* Complete checkbox toggle */}
                <TouchableOpacity
                  style={[styles.checkbox, item.isCompleted && styles.checkboxActive]}
                  onPress={() => toggleComplete(item.id)}
                >
                  {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                {/* Note Content */}
                <View style={styles.noteContentWrap}>
                  <Text
                    style={[styles.noteText, item.isCompleted && styles.noteTextCompleted]}
                  >
                    {item.text}
                  </Text>
                  <Text style={styles.timestampText}>
                    Created at {item.createdAt} • ID: {item.id.slice(-6)}
                  </Text>
                </View>
              </View>

              {/* Step 60: Edit and Delete buttons */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={[styles.toolBtn, styles.editToolBtn]}
                  onPress={() => startEditing(item)}
                >
                  <Text style={styles.editToolText}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toolBtn, styles.deleteToolBtn]}
                  onPress={() => deleteNote(item.id)}
                >
                  <Text style={styles.deleteToolText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTitleWrap: {
    alignItems: 'flex-end',
  },
  headerBadge: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  storageBanner: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  storageStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageTag: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  statusIndicator: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statusDetailText: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 3,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  inputCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 56,
  },
  textInput: {
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
  },
  buttonActionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  addBtn: {
    backgroundColor: '#2563EB',
  },
  updateBtn: {
    backgroundColor: '#059669',
    marginRight: 8,
  },
  cancelBtn: {
    flex: 0.6,
    backgroundColor: '#E5E7EB',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtnText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
  },
  noteCardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.85,
  },
  noteMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  noteContentWrap: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
  noteTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  timestampText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  editToolBtn: {
    backgroundColor: '#EFF6FF',
  },
  editToolText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteToolBtn: {
    backgroundColor: '#FEF2F2',
  },
  deleteToolText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
});

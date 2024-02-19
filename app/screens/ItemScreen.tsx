////////////////////////////////////////////////////////////////////////////
//
// Copyright 2023 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useApp, useAuth, useUser} from '@realm/react';

import {OfflineModeButton} from '../components/OfflineModeButton';
import {colors} from '../styles/colors';
import {useSyncConnection} from '../hooks/useSyncConnection';
import {useItemManager} from '../hooks/useItemManager';
import {AddItemForm} from '../components/AddItemForm';
import {IntroText} from '../components/IntroText';
import {ItemList} from '../components/ItemList';
import {SwitchPanel} from '../components/SwitchPanel';

/**
 * Displays the list of tasks as well as buttons for performing
 * sync-related operations.
 *
 * @note
 * This screen is only meant to be used for the Device Sync enabled
 * part of the app (`AppSync.tsx`).
 */
export function ItemScreen() {
  const app = useApp();
  const user = useUser();
  const {logOut} = useAuth();
  const {isConnected, reconnect, disconnect} = useSyncConnection();
  const {items, addItem, toggleItemStatus, deleteItem, showAll, toggleShowAll} =
    useItemManager(user.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{user?.profile.email}</Text>
          <Text style={styles.info}>{`App ID: ${app.id}`}</Text>
        </View>
        <Pressable style={styles.authButton} onPress={logOut}>
          <Text style={styles.authButtonText}>Log Out</Text>
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.content}>
          <AddItemForm onSubmit={addItem} />
          {items.length === 0 ? (
            <IntroText />
          ) : (
            <ItemList
              items={items}
              onToggleItemStatus={toggleItemStatus}
              onDeleteItem={deleteItem}
            />
          )}
        </View>
        <SwitchPanel
          label="Show All Items"
          value={showAll}
          onValueChange={toggleShowAll}
        />
      </View>
      <OfflineModeButton
        isConnected={isConnected}
        toggleOfflineMode={isConnected ? disconnect : reconnect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.grayMedium,
    backgroundColor: colors.grayLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: colors.grayMedium,
    backgroundColor: colors.white,
  },
  titleContainer: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: colors.purple,
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  info: {
    fontSize: 13,
    color: colors.grayDark,
  },
  authButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: colors.grayMedium,
  },
  authButtonText: {
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
});

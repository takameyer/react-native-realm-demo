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
import {FlatList, StyleSheet, View} from 'react-native';

import {Item} from '../models/Item';
import {ItemView} from './ItemView';

type ItemListProps = {
  items: Realm.Results<Item>;
  onToggleItemStatus: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
};

/**
 * Displays a list of tasks.
 */
export function ItemList({
  items,
  onToggleItemStatus,
  onDeleteItem,
}: ItemListProps) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        keyExtractor={item => item._id.toString()}
        renderItem={({item: Item}) => (
          <ItemView
            item={Item}
            onToggleStatus={onToggleItemStatus}
            onDelete={onDeleteItem}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

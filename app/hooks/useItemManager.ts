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

import {useCallback, useEffect, useState} from 'react';
import {useQuery, useRealm, useUser} from '@realm/react';

import {Item} from '../models/Item';

const itemSubscriptionName = 'items';
const ownItemsSubscriptionName = 'ownItems';

/**
 * Provides functions for managing changes to the tasks in the Realm,
 * such as adding, updating, and deleting tasks.
 *
 * @param userId The App user's ID if sync is enabled.
 */
export function useItemManager(userId = 'SYNC_DISABLED') {
  const realm = useRealm();
  console.log('sync session: ', realm.syncSession);
  const user = useUser();

  // This state will be used to toggle between showing all items and only showing the current user's items
  // This is initialized based on which subscription is already active
  const [showAll, setShowAll] = useState(
    !!realm.subscriptions.findByName(itemSubscriptionName),
  );
  const items = useQuery(Item, col => col.sorted('created_at'));

  /**
   * Adds a task to the database.
   *
   * @note
   * Everything in the function passed to `realm.write()` is a transaction and will
   * hence succeed or fail together. A transaction is the smallest unit of transfer
   * in Realm so we want to be mindful of how much we put into one single transaction
   * and split them up if appropriate (more commonly seen server side). Since clients
   * may occasionally be online during short time spans we want to increase the probability
   * of sync participants to successfully sync everything in the transaction, otherwise
   * no changes propagate and the transaction needs to start over when connectivity allows.
   */
  const addItem = useCallback(
    (summary: string) => {
      if (!summary) {
        return;
      }
      realm.write(() => {
        realm.create(Item, {summary, owner_id: userId});
      });
    },
    [realm, userId],
  );

  /**
   * Updates a task by toggling its `isComplete` status.
   *
   * @note
   * Normally when updating a record in a NoSQL or SQL database, we have to type
   * a statement that will later be interpreted and used as instructions for how
   * to update the record. But in Realm, the objects are "live" because they are
   * actually referencing the object's location in memory on the device (memory mapping).
   * So rather than typing a statement, we modify the object directly by changing
   * the property values. If the changes adhere to the schema, Realm will accept
   * this new version of the object and wherever this object is being referenced
   * locally will also see the changes "live".
   */
  const toggleItemStatus = useCallback(
    (task: Item) => {
      realm.write(() => {
        task.isComplete = !task.isComplete;
      });

      // Alternatively if passing the ID as the argument to toggleItemStatus:
      // realm.write(() => {
      //   // If the ID is passed as an ObjectId:
      //   const task = realm.objectForPrimaryKey('Item', id);
      //   // Or, if the ID is passed as a string:
      //   const task = realm.objectForPrimaryKey('Item', Realm.BSON.ObjectId(id));
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realm],
  );

  /**
   * Deletes a task from the database.
   */
  const deleteItem = useCallback(
    (task: Item) => {
      realm.write(() => {
        realm.delete(task);

        // Alternatively if passing the ID as the argument to handleDeleteItem:
        // realm.delete(realm.objectForPrimaryKey('Item', id));
      });
    },
    [realm],
  );

  const toggleShowAll = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll, setShowAll]);

  useEffect(() => {
    // if (realm.syncSession) {
    //   // This effect will initialize the subscription to the items collection
    //   // By default it will filter out all items that do not belong to the current user
    //   // If the user toggles the switch to show all items, the subscription will be updated to show all items
    //   // The old subscription will be removed and the new subscription will be added
    //   // This allows for tracking the state of the toggle switch by the name of the subscription
    //   if (showAll) {
    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(ownItemsSubscriptionName);
    //       mutableSubs.add(realm.objects(Item), {name: itemSubscriptionName});
    //     });
    //   } else {
    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(itemSubscriptionName);
    //       mutableSubs.add(
    //         realm.objects(Item).filtered(`owner_id == "${user?.id}"`),
    //         {name: ownItemsSubscriptionName},
    //       );
    //     });
    //   }
    // }
  }, [showAll, user, realm]);

  return {
    items,
    addItem,
    toggleItemStatus,
    deleteItem,
    showAll,
    toggleShowAll,
  };
}

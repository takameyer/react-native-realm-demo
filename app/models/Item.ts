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

import Realm, {BSON} from 'realm';

export class Item extends Realm.Object {
  _id: BSON.ObjectId = new BSON.ObjectId();
  isComplete: boolean = false;
  owner_id!: string;
  summary!: string;
  created_at!: Date;

  static primaryKey = '_id';
  static schema: Realm.ObjectSchema = {
    name: 'Item',
    primaryKey: '_id',
    properties: {
      // This allows us to automatically generate a unique _id for each Item
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      // All todo items will default to incomplete
      isComplete: {type: 'bool', default: false},
      owner_id: 'string',
      summary: 'string',
      created_at: {type: 'date', default: () => new Date()},
    },
  };
}

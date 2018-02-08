/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import {
    ContentMetadataConfig,
    LayoutOrientedConfig,
    LayoutOrientedConfigItem,
    PropertyGroup,
    OrganisedPropertyGroup
} from '../../interfaces/content-metadata.interfaces';
import { getProperty } from './property-group-reader';

@Injectable()
export class LayoutOrientedConfigService implements ContentMetadataConfig {

    constructor(private config: LayoutOrientedConfig) {}

    public isGroupAllowed(groupName: string): boolean {
        return this.getMatchingGroups(groupName).length > 0;
    }

    public isPropertyAllowed(groupName: string, propertyName: string): boolean {
        if (this.isEveryPropertyAllowedFor(groupName)) {
            return true;
        }

        const matchingItems = this
            .getMatchingGroups(groupName)
            .filter(item => item.properties.indexOf(propertyName) !== -1);

        return matchingItems.length > 0;
    }

    public reorganiseByConfig(propertyGroups: PropertyGroup[]): OrganisedPropertyGroup[] {
        const layoutBlocks = this.config;

        return layoutBlocks.map((layoutBlock) => {
            const flattenedItems = this.flattenItems(layoutBlock.items),
                properties = flattenedItems.reduce((props, explodedItem) => {
                    const property = getProperty(propertyGroups, explodedItem.groupName, explodedItem.propertyName) || [];
                    return props.concat(property);
                }, []);

            return {
                title: layoutBlock.title,
                properties
            };
        });
    }

    private flattenItems(items) {
        return items.reduce((accumulator, item) => {
            const properties = Array.isArray(item.properties) ? item.properties : [item.properties];
            const flattenedProperties = properties.map(propertyName => {
                return {
                    groupName: item.aspect || item.type,
                    propertyName
                };
            });

            return accumulator.concat(flattenedProperties);
        }, []);
    }

    private getMatchingGroups(groupName: string): LayoutOrientedConfigItem[] {
        return this.config
            .map(layoutBlock => layoutBlock.items)
            .reduce((accumulator, items) => accumulator.concat(items), [])
            .filter((item) => item.aspect === groupName || item.type === groupName);
    }

    private isEveryPropertyAllowedFor(groupName: string): boolean {
        const matchingItems = this
            .getMatchingGroups(groupName)
            .filter(item => item.properties === '*');

        return matchingItems.length > 0;
    }
}

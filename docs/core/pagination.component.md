---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# Pagination Component

Adds pagination to the component it is used with.

![](../docassets/images/basic.png)

## Contents

-   [Basic Usage](#basic-usage)

-   [Class members](#class-members)

    -   [Properties](#properties)
    -   [Events](#events)

-   [Details](#details)

    -   [Integrating with the Document List component](#integrating-with-the-document-list-component)
    -   [Custom pagination](#custom-pagination)

-   [See also](#see-also)

## Basic Usage

```html
<adf-pagination
    [pagination]="pagination"
    [supportedPageSizes]="sizes"
    (change)="onChange($event)"
    (nextPage)="onNextPage($event)"
    (prevPage)="onPreviousPage($event)"
    (changePageSize)="onChangePageSize($event)"
    (changePageNumber)="onChangePageNumber($event)">
</adf-pagination>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| pagination | [`PaginationModel`](../../lib/core/models/pagination.model.ts) |  [`PaginationComponent`](../core/pagination.component.md).DEFAULT_PAGINATION | [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) object. |
| supportedPageSizes | `number[]` |  [5, 25, 50, 100] | An array of page sizes. |
| target | `PaginatedComponent` |  | Component that provides custom pagination support. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| change | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PaginationModel`](../../lib/core/models/pagination.model.ts)`>` | Emitted when pagination changes in any way. |
| changePageNumber | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PaginationModel`](../../lib/core/models/pagination.model.ts)`>` | Emitted when the page number changes. |
| changePageSize | `EventEmitter<PaginationModel>` | Emitted when the page size changes. |
| nextPage | `EventEmitter<PaginationModel>` | Emitted when the next page is requested. |
| prevPage | `EventEmitter<PaginationModel>` | Emitted when the previous page is requested. |

## Details

You can use the [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) component to add pagination features to other components. The Alfresco
APIs make use of pagination to reduce the amount of data transferred in a single call. The start offset
and number of items in the page are passed during the call. The items of interest will be
returned along with a [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) object. You can use this object to set up the [pagination component](../core/pagination.component.md)
and then subscribe to one of the page change events. This will return updated pagination data that you
can pass to a subsequent API call.

Each event corresponds to a particular action from the user. For the `change` event, a
[PaginationQueryParams](https://github.com/Alfresco/alfresco-ng2-components/blob/development/ng2-components/ng2-alfresco-core/src/components/pagination/pagination-query-params.interface.ts) object is returned. This contains the query
parameters supported by the REST API, `skipCount` and `maxItems`. 

For all events other than `change`, a new [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) object is returned as in the following example. The
new object contains updated properties that you can use to fetch the next page of information.

### Integrating with the Document List component

```html
<adf-document-list #documentList ...></adf-document-list>

<adf-pagination [target]="documentList" ...>
</adf-pagination>
```

### Custom pagination

The component also makes it easy to integrate your own implementation of pagination.
You can supply any component that implements the [`PaginatedComponent`](../../lib/core/pagination/paginated-component.interface.ts) interface as the value of the
`target` property.

```js
export interface PaginatedComponent {

    pagination: Subject<Pagination>;
    updatePagination(params: PaginationQueryParams);

}
```

Your component must provide a `pagination` subject to allow the [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) component to respond to changes.
Every time user interacts with the [`Pagination`](../../lib/content-services/document-list/models/document-library.model.ts) component, it will call the `updatePagination` method
and pass the updated parameters.

## See also

-   [Infinite Pagination component](infinite-pagination.component.md)

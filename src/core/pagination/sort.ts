/**
 * Represents the sorting direction.
 */
export type Direction = 'asc' | 'desc';

type PropertyOf<T> =
    T extends string
        ? (string extends T ? never : T)
        : T extends object
            ? Extract<keyof T, string>
            : never;


/**
 * Represents a single sorting criterion.
 * @template T The type of the entity (optional).
 */
export interface Order<T = any> {
    /** The name of the property to sort by. */
    readonly property: PropertyOf<T>;
    /** The direction of the sort (asc or desc). */
    readonly direction: Direction;
}

/**
 * Represents a collection of sorting orders.
 * This class is immutable; all modification methods return a new instance.
 *
 * @template T The type of the entity being sorted.
 */
export class Sort<T = any> {
    /** A static constant representing an unsorted state. */
    public static readonly UNSORTED = new Sort<unknown>([]);

    /**
     * Creates a new Sort instance.
     * @param orders The list of sort orders.
     */
    constructor(public readonly orders: Order<T>[]) {
    }

    /**
     * Checks if the sort configuration is empty.
     * @returns `true` if there are no sort orders, `false` otherwise.
     */
    public get isUnsorted(): boolean {
        return this.orders.length === 0;
    }

    get object(): Partial<Record<keyof T, Direction>> {
        return this.orders.reduce((acc, order) => {
            acc[order.property as keyof T] = order.direction;
            return acc;
        }, {} as Partial<Record<keyof T, Direction>>);
    }

    /**
     * Factory method to create a Sort instance for a specific property.
     *
     * @template T The entity type.
     * @param property The property to sort by.
     * @param direction The sort direction (default is 'asc').
     * @returns A new Sort instance.
     * @example Sort.by<User>('name', 'desc')
     */
    static by<T>(property: PropertyOf<T>, direction: Direction = 'asc'): Sort<T> {
        return new Sort<T>([{property, direction}]);
    }

    /**
     * Chains another sorting criterion to the existing ones.
     * Useful for multi-column sorting.
     *
     * @param property The next property to sort by.
     * @param direction The sort direction (default is 'asc').
     * @returns A new Sort instance containing the previous orders plus the new one.
     * @example sort.and('createdAt', 'desc')
     */
    and(property: PropertyOf<T>, direction: Direction = 'asc'): Sort<T> {
        return new Sort<T>([...this.orders, {property, direction}]);
    }

    /**
     * Returns a new Sort instance with ALL orders converted to Descending.
     * @returns A new Sort instance.
     */
    desc(): Sort<T> {
        const newOrders = this.orders.map((o) => ({
            ...o,
            direction: 'desc' as Direction,
        }));
        return new Sort<T>(newOrders);
    }

    /**
     * Returns a new Sort instance with ALL orders converted to Ascending.
     * @returns A new Sort instance.
     */
    asc(): Sort<T> {
        const newOrders = this.orders.map((o) => ({
            ...o,
            direction: 'asc' as Direction,
        }));
        return new Sort<T>(newOrders);
    }

    /**
     * Serializes the sort configuration to API query string.
     * Format: "-property,property"
     *
     * Rules:
     * - Descending: prefix with '-'
     * - Ascending: no prefix
     * - Separator: comma ','
     *
     * @returns The serialized sort string, or empty string if unsorted.
     * @example "-name,age"
     */
    toString(): string {
        if (this.isUnsorted) return '';

        return this.orders
            .map((o) => (o.direction.toLowerCase() === 'desc' ? `-${String(o.property)}` : String(o.property)))
            .join(',');
    }

    /**
     * Parses a sort string into a Sort object.
     *
     * Format: "-property,property"
     * - Descending: prefix '-'
     * - Ascending: no prefix
     * - Separator: comma ','
     *
     * @template T The entity type.
     * @param sortString The sort string (e.g., "-name,age").
     * @returns A new Sort instance.
     */
    static from<T = any>(sortString?: string): Sort<T> {
        if (!sortString?.trim()) return new Sort<T>([]);
        const orders = sortString
            .split(',')
            .map((token) => token.trim())
            .filter(Boolean)
            .map((token) => {
                const desc = token.startsWith('-');
                const property = (desc ? token.slice(1) : token).trim();

                return {
                    property,
                    direction: desc ? 'desc' : 'asc',
                } as Order<T>;
            });

        return new Sort<T>(orders);
    }
}
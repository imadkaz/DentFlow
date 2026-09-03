export interface IMapper<T, U> {
    map(entity: T): U;
    reverse(model: U): T;
}
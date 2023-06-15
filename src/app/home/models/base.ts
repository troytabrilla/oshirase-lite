export interface IModel<T> {
    validate(data: unknown): T
}

export interface IModelList<T> {
    fetch(...args: any[]): Promise<T[]>
}

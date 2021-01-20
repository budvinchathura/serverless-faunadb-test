export type FaunaDBObject = {
    data: {
        [key: string]: string;
    }
    ref: {
        id: string
    }
}

export type FaunaDBListResult = {
    data: Array<FaunaDBObject>
};
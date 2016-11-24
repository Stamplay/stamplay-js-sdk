/// <reference types="Q" />

export = Stamplay;

export as namespace Stamplay;

declare var Stamplay: Stamplay.StamplayStatic;

declare module Stamplay {

    interface StamplayStatic {
        /**
     * Methods for Stamplay Objects management.
     *
     */
        Object(objectName: string): IObject,

        /**
    * Methods for Stamplay Users management.
    *
    */
        User: IUser,

        /**
    * Methods for Stamplay Codeblocks management.
    *
    */
        Codeblock(codeblockName: string): ICodeblock,

        /**
    * Methods for calling Webhooks.
    *
    */
        Webhook(webhookName: string): IWebhook,

        /**
    * First-class Stripe API interface wrapper.
    *
    */
        Stripe: IStripe,

        /**
    * Advaced Stamplay Queries.
    *
    */
        Query(resourceName: string, propertyName: string): IQuery,

        /**
    * Initialiase the Stamplay app with this method.
    *
    */
        init(appId: string, options?: any): void;
    }
}

interface IObject {

    save(data: any): Q.Promise<any>;
    save(data: any, callback?: CallbackType): void;

    get(data: any): Q.Promise<any>;
    get(data: any, callback?: CallbackType): void;

    getById(id: string, data: any): Q.Promise<any>;
    getById(id: string, data: any, callback?: CallbackType): void;

    remove(id: string): Q.Promise<any>;
    remove(id: string, callback?: CallbackType): void;

    update(id: string, data: any): Q.Promise<any>;
    update(id: string, data: any, callback?: CallbackType): void;

    patch(id: string, data: any): Q.Promise<any>;
    patch(id: string, data: any, callback?: CallbackType): void;

    findByCurrentUser(attribute?: string, data?: any): Q.Promise<any>;
    findByCurrentUser(attribute?: string, data?: any, callback?: CallbackType): void;

    upVote(id: string): Q.Promise<any>;
    upVote(id: string, callback?: CallbackType): void;

    downVote(id: string): Q.Promise<any>;
    downVote(id: string, callback?: CallbackType): void;

    rate(id: string, rate: number): Q.Promise<any>;
    rate(id: string, rate: number, callback?: CallbackType): void;

    comment(id: string, text: string): Q.Promise<any>;
    comment(id: string, text: string, callback?: CallbackType): void;

    push(id: string, attribute: string, data: any): Q.Promise<any>;
    push(id: string, attribute: string, data: any, callback?: CallbackType): void;
}

interface IUser {

    save(data: any): Q.Promise<any>;
    save(data: any, callback?: CallbackType): void;

    get(data: any): Q.Promise<any>;
    get(data: any, callback?: CallbackType): void;

    getById(id: string, data: any): Q.Promise<any>;
    getById(id: string, data: any, callback?: CallbackType): void;

    remove(id: string): Q.Promise<any>;
    remove(id: string, callback?: CallbackType): void;

    update(id: string, data: any): Q.Promise<any>;
    update(id: string, data: any, callback?: CallbackType): void;

    currentUser(): Q.Promise<any>;
    currentUser(callback?: CallbackType): void;

    login(data: any): Q.Promise<any>;
    login(data: any, callback?: CallbackType): void;

    socialLogin(provider: string): Q.Promise<any>;
    socialLogin(provider: string, callback?: CallbackType): void;

    signup(data: any): Q.Promise<any>;
    signup(data: any, callback?: CallbackType): void;

    logout(): void
    logout(async: boolean, callback?: CallbackType): void;

    resetPassword(data: any): Q.Promise<any>;
    resetPassword(data: any, callback?: CallbackType): void;

    getRoles(): Q.Promise<any>;
    getRoles(callback?: CallbackType): void;

    getRole(id: string): Q.Promise<any>;
    getRole(id: string, callback?: CallbackType): void;

    setRole(id: string, roleId: string): Q.Promise<any>;
    setRole(id: string, roleId: string, callback?: CallbackType): void;
}

interface ICodeblock {

    post(data: any, params?: any): Q.Promise<any>;
    post(data: any, params?: any, callback?: CallbackType): void;

    put(data: any, params?: any): Q.Promise<any>;
    put(data: any, params?: any, callback?: CallbackType): void;

    patch(data: any, params?: any): Q.Promise<any>;
    patch(data: any, params?: any, callback?: CallbackType): void;

    get(params?: any): Q.Promise<any>;
    get(params?: any, callback?: CallbackType): void;

    delete(params?: any): Q.Promise<any>;
    delete(params?: any, callback?: CallbackType): void;

    run(data: any, params?: any): Q.Promise<any>;
    run(data: any, params?: any, callback?: CallbackType): void;

}

interface IWebhook {

    post(data: any): Q.Promise<any>;
    post(data: any, callback?: CallbackType): void;

}

interface IStripe {

    charge(userId: string, token: string, amount: string, currency?: string): Q.Promise<any>;
    charge(userId: string, token: string, amount: string, currency?: string, callback?: CallbackType): void;

    createCreditCard(userId: string, token: string, ): Q.Promise<any>;
    createCreditCard(userId: string, token: string, callback?: CallbackType): void;

    createCustomer(userId: string): Q.Promise<any>;
    createCustomer(userId: string, callback?: CallbackType): void;

    createSubscription(userId: string, planId: string, ): Q.Promise<any>;
    createSubscription(userId: string, planId: string, callback?: CallbackType): void;

    deleteSubscription(userId: string, subscriptionId: string, options?: any): Q.Promise<any>;
    deleteSubscription(userId: string, subscriptionId: string, options?: any, callback?: CallbackType): void;

    getCreditCard(userId: string): Q.Promise<any>;
    getCreditCard(userId: string, callback?: CallbackType): void;

    getSubscription(userId: string, subscriptionId: string): Q.Promise<any>;
    getSubscription(userId: string, subscriptionId: string, callback?: CallbackType): void;

    getSubscriptions(userId: string, options?: any): Q.Promise<any>;
    getSubscriptions(userId: string, options?: any, callback?: CallbackType): void;

    updateCreditCard(userId: string, token: string): Q.Promise<any>;
    updateCreditCard(userId: string, token: string, callback?: CallbackType): void;

    updateSubscription(userId: string, subscriptionId: string, options?: any): Q.Promise<any>;
    updateSubscription(userId: string, subscriptionId: string, options?: any, callback?: CallbackType): void;

}

interface IQuery extends Q.IPromise<any> {

    greaterThan(attr: string, value: any): IQuery
    greaterThanOrEqual(attr: string, value: any): IQuery
    lessThan(attr: string, value: any): IQuery
    lessThanOrEqual(attr: string, value: any): IQuery
    pagination(page: any, per_page: any): IQuery
    between(attr: string, value1: any, value2: any): IQuery
    equalTo(attr: string, value: any): IQuery
    notEqualTo(attr: string, value: any): IQuery
    exists(attr: string): IQuery
    notExists(attr: string): IQuery
    sortAscending(attr: string): IQuery
    sortDescending(attr: string): IQuery
    populate(): IQuery
    populateOwner(): IQuery
    select(...attr: string[]): IQuery
    regex(attr: string, regex: any, options: any): IQuery
    near(type: any, coordinates: any, maxDistance: any, minDistance?: any): IQuery
    nearSphere(type: any, coordinates: any, maxDistance: any, minDistance?: any): IQuery
    geoIntersects(type: any, coordinates: any): IQuery
    geoWithinGeometry(type: any, coordinates: any): IQuery
    geoWithinCenterSphere(coordinates: any, radius: any): IQuery
    or(...query: IQuery[]): IQuery
    exec(callback?: CallbackType): Q.IPromise<any>
}

interface CallbackType {
    (err: any, res: any): any
}


export interface IActivator<T> {
    (...dependencies): T;
}

export enum Lifetime {
    Default,

    Singleton
}

interface IRegistration<T> {
    activator: IActivator<T>;
    dependencies: string[];

    lifetime: Lifetime;

    instance?: T;
}

export class Container {
    private _registrations: { [name: string]: IRegistration<any> } = {};

    public registerSingle<T>(name: string, activator: IActivator<T>, dependencies: string[]) {
        this.register<T>(name, activator, dependencies, Lifetime.Singleton);
    }

    public register<T>(name: string, activator: IActivator<T>, dependencies: string[] = [], lifetime: Lifetime = Lifetime.Default) {
        this._registrations[name] = {
            activator: activator,
            dependencies: dependencies,
            lifetime: lifetime
        };
    }

    public get<T>(name: string): T {
        let registration = this._registrations[name];
        if (!registration) {
            throw new Error("Type not registered");
        }

        switch (registration.lifetime) {
            case Lifetime.Singleton:
                {
                    if (!registration.instance) {
                        registration.instance = this._createInstance(registration);
                    }

                    return registration.instance;
                }

            default:
                return this._createInstance<T>(registration);
        }
    }

    private _createInstance<T>(registration: IRegistration<T>): T {
        let deps: any[] = [];
        if (registration.dependencies.length > 0) {
            deps = registration.dependencies.map(name => this.get(name));
        }

        return registration.activator(deps);
    }
}
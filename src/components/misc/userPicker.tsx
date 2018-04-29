import * as React from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { getCachedClient } from "../../clients/clientFactory";
import { UserClient, UserReference } from "../../external/imperaClients";
import { autobind } from "../../lib/autobind";

export interface IUserPickerProps {
    name: string;

    initialValue?: UserReference;

    onChange?: (value: UserReference) => void;
}

export interface IUserPickerState {
    users: UserReference[];
}

export class UserPicker extends React.Component<IUserPickerProps, IUserPickerState> {
    constructor(props: IUserPickerProps) {
        super(props);

        this.state = {
            users: []
        };
    }

    public render() {
        const { name, initialValue } = this.props;

        return (
            <AsyncTypeahead
                allowNew={false}
                multiple={false}
                name={name}
                onChange={this._onChange}
                onSearch={this._handleSearch}
                placeholder={__("User")}
                labelKey="name"
                renderMenuItemChildren={this._renderUsers}
                promptText={__("Find users")}
                searchText={__("Looking for users...")}
                emptyLabel={__("No users found.")}
                minLength={3}
                delay={300}
                options={this.state.users}
                selected={initialValue && [initialValue]}
            />
        );
    }

    @autobind
    private _onChange(changedOptions: UserReference[]) {
        const { onChange } = this.props;

        onChange(changedOptions[0]);
    }

    @autobind
    private _renderUsers(option: UserReference, props, index) {
        return (
            <div key={option.id}>
                {option.name}
            </div>
        );
    }

    @autobind
    private _handleSearch(query: string) {
        if (query && query.length >= 3) {
            getCachedClient(UserClient).findUsers(query).then(users => {
                this.setState({
                    users
                });
            });
        }
    }
}
import * as React from "react";
import { AsyncTypeahead, TypeaheadResult } from "react-bootstrap-typeahead";
import { ReactReduxContext } from "react-redux";
import { createClient } from "../../clients/clientFactory";
import { UserClient, UserReference } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { getToken } from "../../lib/domain/shared/session/session.selectors";

export interface IUserPickerProps {
    name: string;

    initialValue?: UserReference;

    onChange?: (value: UserReference) => void;
}

export interface IUserPickerState {
    users: UserReference[];
}

export class UserPicker extends React.Component<
    IUserPickerProps,
    IUserPickerState
> {
    static contextType = ReactReduxContext;

    constructor(props: IUserPickerProps, context) {
        super(props, context);

        this.state = {
            users: [],
        };
    }

    public render() {
        const { initialValue } = this.props;

        return (
            <AsyncTypeahead
                isLoading={false}
                allowNew={false}
                multiple={false}
                onChange={this._onChange}
                onSearch={this._handleSearch}
                placeholder={__("User")}
                renderMenuItemChildren={this._renderUsers}
                promptText={__("Find users")}
                searchText={__("Looking for users...")}
                emptyLabel={__("No users found.")}
                minLength={3}
                labelKey="name"
                delay={300}
                options={this.state.users}
                selected={initialValue && [initialValue]}
                filterBy={["name"]}
            />
        );
    }

    private _onChange = (changedOptions: UserReference[]) => {
        const { onChange } = this.props;

        onChange(changedOptions[0]);
    };

    private _renderUsers = (
        option: TypeaheadResult<UserReference>,
        props,
        index
    ) => {
        return <div key={option.id}>{option.name}</div>;
    };

    private _handleSearch = (query: string) => {
        if (query && query.length >= 3) {
            createClient(getToken(this.context.store.getState()), UserClient)
                .findUsers(query)
                .then((users) => {
                    this.setState({
                        users,
                    });
                });
        }
    };
}

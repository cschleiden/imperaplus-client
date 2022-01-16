import Router from "next/router";
import * as React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { GridColumn, GridRow } from "../../../components/layout";
import { HumanDate } from "../../../components/ui/humanDate";
import { Loading } from "../../../components/ui/loading";
import { ProgressButton } from "../../../components/ui/progressButton";
import { Section, SubSection } from "../../../components/ui/typography";
import { AllianceJoinRequestState } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import {
    changeAdmin,
    deleteAlliance,
    fetch,
    leave,
    removeMember,
    requestJoin,
    updateRequest,
} from "../../../lib/domain/game/alliances.slice";
import Form from "../../../lib/domain/shared/forms/form";
import {
    ControlledCheckBox,
    ControlledTextField,
} from "../../../lib/domain/shared/forms/inputs";
import { IState } from "../../../reducers";
import { AppDispatch, AppNextPage } from "../../../store";

function selector(state: IState) {
    const { alliance, requests, pendingRequests, isLoading } = state.alliances;
    const userInfo = state.session.userInfo;
    const allianceId = userInfo && userInfo.allianceId;
    const allianceAdmin = userInfo && userInfo.allianceAdmin;
    const userId = userInfo && userInfo.userId;

    const notAMemberOfCurrentAlliance =
        alliance && !alliance.members.some((x) => x.id === userId);
    const notInAnyAlliance = !allianceId;
    const hasPendingRequest =
        alliance &&
        pendingRequests &&
        pendingRequests.some(
            (x) =>
                x.allianceId === alliance.id &&
                x.state === AllianceJoinRequestState.Active
        );
    const hasOtherPendingRequest =
        alliance &&
        pendingRequests &&
        pendingRequests.some(
            (x) =>
                x.allianceId !== alliance.id &&
                x.state === AllianceJoinRequestState.Active
        );
    const isMember = alliance && !!allianceId && alliance.id === allianceId;

    return {
        isLoading,
        userId: userId,
        alliance: alliance,
        requests: requests,
        isAdmin: isMember && allianceAdmin,
        isMember,
        // User can join this alliance:
        // - not a member of any alliance
        // - and, there is no active request
        canJoin:
            alliance &&
            pendingRequests &&
            notAMemberOfCurrentAlliance &&
            notInAnyAlliance &&
            !hasPendingRequest,
        hasPendingRequest,
        hasOtherPendingRequest,
    };
}

const AllianceInfoComponent: AppNextPage<ReturnType<typeof selector>> = (
    props
) => {
    const {
        alliance,
        isAdmin,
        isMember,
        requests,
        canJoin,
        hasPendingRequest,
        userId,
    } = props;

    const dispatch = useDispatch<AppDispatch>();

    if (!alliance) {
        return <Loading />;
    }

    return (
        <GridRow>
            <GridColumn className="col-xs-12">
                <Section>{__("Members")}</Section>
                <ul>
                    {alliance &&
                        alliance.members &&
                        alliance.members.map((member) => (
                            <li key={member.id}>
                                {member.name}
                                {isAdmin && member.id !== userId && (
                                    <span>
                                        <Button
                                            bsSize="xsmall"
                                            bsStyle="link"
                                            title={__(
                                                "Remove user from alliance"
                                            )}
                                            onClick={() => {
                                                dispatch(
                                                    removeMember({
                                                        allianceId: alliance.id,
                                                        userId: member.id,
                                                    })
                                                );
                                            }}
                                        >
                                            {__("Remove")}
                                        </Button>
                                        {!alliance.admins.some(
                                            (a) => a.id === member.id
                                        ) ? (
                                            <Button
                                                bsSize="xsmall"
                                                bsStyle="link"
                                                onClick={() => {
                                                    dispatch(
                                                        changeAdmin({
                                                            allianceId:
                                                                alliance.id,
                                                            userId: member.id,
                                                            isAdmin: true,
                                                        })
                                                    );
                                                }}
                                            >
                                                {__("Make admin")}
                                            </Button>
                                        ) : (
                                            <Button
                                                bsSize="xsmall"
                                                bsStyle="link"
                                                onClick={() => {
                                                    changeAdmin({
                                                        allianceId: alliance.id,
                                                        userId: member.id,
                                                        isAdmin: false,
                                                    });
                                                }}
                                            >
                                                {__("Remove admin")}
                                            </Button>
                                        )}
                                    </span>
                                )}
                            </li>
                        ))}
                </ul>

                <Section>{__("Admins")}</Section>
                <ul>
                    {alliance &&
                        alliance.admins &&
                        alliance.admins.map((admin) => (
                            <li key={admin.id}>{admin.name}</li>
                        ))}
                </ul>

                {(canJoin || hasPendingRequest) && (
                    <div>
                        <Section>{__("Join")}</Section>
                        {!hasPendingRequest && (
                            <div>
                                <div>
                                    {__(
                                        "Here you can ask the administrators for permission to join."
                                    )}
                                </div>
                                <Form
                                    name="alliance-request-join"
                                    onSubmit={async (formState, dispatch) => {
                                        await dispatch(
                                            requestJoin({
                                                allianceId: alliance.id,
                                                reason: formState.getFieldValue(
                                                    "reason"
                                                ),
                                            })
                                        );

                                        // Reload page
                                        Router.reload();
                                    }}
                                    component={({ isPending, formState }) => (
                                        <div>
                                            <ControlledTextField
                                                label={__("Reason")}
                                                fieldName="reason"
                                                required={true}
                                            />

                                            <ProgressButton
                                                type="submit"
                                                bsStyle="primary"
                                                disabled={
                                                    !formState.getFieldValue(
                                                        "reason"
                                                    )
                                                }
                                                isActive={isPending}
                                            >
                                                {__("Request to join")}
                                            </ProgressButton>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {hasPendingRequest && (
                            <div>
                                {__(
                                    "You have a pending request to join this alliance"
                                )}
                            </div>
                        )}
                    </div>
                )}

                {isMember && (
                    <div>
                        <Section>{__("Membership")}</Section>
                        <div>
                            <Form
                                name="alliance-leave"
                                onSubmit={async (_, dispatch) => {
                                    await dispatch(leave(alliance.id));
                                }}
                                component={({ isPending, formState }) => (
                                    <div>
                                        <ProgressButton
                                            type="submit"
                                            bsStyle="primary"
                                            isActive={isPending}
                                        >
                                            {__("Leave Alliance")}
                                        </ProgressButton>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <div>
                        <Section>{__("Administration")}</Section>

                        <SubSection>{__("Requests")}</SubSection>
                        {requests && requests.length > 0 ? (
                            <ul>
                                {requests.map((request) => {
                                    return (
                                        <li key={request.id}>
                                            {HumanDate(request.createdAt)} -{" "}
                                            {request.requestedByUser.name} -{" "}
                                            {request.reason} - {request.state} -{" "}
                                            {HumanDate(request.lastModifiedAt)}
                                            {request.state ===
                                                AllianceJoinRequestState.Active && (
                                                <span>
                                                    <Button
                                                        bsSize="xsmall"
                                                        bsStyle="link"
                                                        onClick={() => {
                                                            dispatch(
                                                                updateRequest({
                                                                    allianceId:
                                                                        alliance.id,
                                                                    requestId:
                                                                        request.id,
                                                                    state: AllianceJoinRequestState.Approved,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        {__("Approve")}
                                                    </Button>
                                                    <Button
                                                        bsSize="xsmall"
                                                        bsStyle="link"
                                                        onClick={() => {
                                                            dispatch(
                                                                updateRequest({
                                                                    allianceId:
                                                                        alliance.id,
                                                                    requestId:
                                                                        request.id,
                                                                    state: AllianceJoinRequestState.Denied,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        {__("Reject")}
                                                    </Button>
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div>
                                {__(
                                    "When users request to join your alliance, you will see their requests here, and you can then approve or deny."
                                )}
                            </div>
                        )}

                        <SubSection>{__("Delete Alliance")}</SubSection>
                        <div className="tag-box-v3">
                            <strong>{__("Warning")}:&nbsp;</strong>
                            <span>{__("This action cannot be undone.")}</span>
                        </div>

                        <Form
                            name="alliance-delete"
                            onSubmit={async (formState, dispatch) => {
                                await dispatch(deleteAlliance(alliance.id));
                            }}
                            component={({ isPending, formState }) => (
                                <div>
                                    <ControlledCheckBox
                                        label={__(
                                            "Yes, I really want to delete the alliance"
                                        )}
                                        fieldName="confirmDelete"
                                        required={true}
                                    />

                                    <ProgressButton
                                        type="submit"
                                        bsStyle="primary"
                                        disabled={
                                            !formState.getFieldValue(
                                                "confirmDelete"
                                            )
                                        }
                                        isActive={isPending}
                                    >
                                        {__("Delete")}
                                    </ProgressButton>
                                </div>
                            )}
                        />
                    </div>
                )}
            </GridColumn>
        </GridRow>
    );
};

AllianceInfoComponent.needsLogin = true;
AllianceInfoComponent.getTitle = (state) =>
    `Alliance: ${state.alliances.alliance?.name || ""}`;
AllianceInfoComponent.getInitialProps = async (ctx) => {
    const allianceId = ctx.query["allianceId"] as string;

    await ctx.store.dispatch(fetch(allianceId));

    return selector(ctx.store.getState());
};

export default AllianceInfoComponent;

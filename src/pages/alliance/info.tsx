import * as React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import Form, { IFormState } from "../../common/forms/form";
import {
  ControlledCheckBox,
  ControlledTextField
} from "../../common/forms/inputs";
import { setTitle } from "../../common/general/general.actions";
import { GridRow, GridColumn } from "../../components/layout";
import { HumanDate } from "../../components/ui/humanDate";
import { Loading } from "../../components/ui/loading";
import { ProgressButton } from "../../components/ui/progressButton";
import { Section, SubSection } from "../../components/ui/typography";
import {
  Alliance,
  AllianceJoinRequest,
  AllianceJoinRequestState
} from "../../external/imperaClients";
import { IState } from "../../reducers";
import {
  deleteAlliance,
  get,
  leave,
  requestJoin,
  updateRequest
} from "./alliances.actions";

export interface IAllianceInfoProps {
  params?: {
    id: string;
  };

  setTitle: (title: string) => void;

  alliance: Alliance;
  requests: AllianceJoinRequest[];

  userId: string;

  /** Is the current user admin of the current alliance */
  isAdmin: boolean;
  /** Is the current user member of the current alliance */
  isMember: boolean;
  /** Can the current user join an alliance */
  canJoin: boolean;
  hasPendingRequest: boolean;
  hasOtherPendingRequest: boolean;

  get: (id: string) => void;
  updateRequest: (
    allianceId: string,
    requestId: string,
    state: AllianceJoinRequestState
  ) => void;
}

export class AllianceInfoComponent extends React.Component<IAllianceInfoProps> {
  componentWillMount() {
    this.props.get(this.props.params.id);
  }

  public componentDidUpdate() {
    const { alliance, setTitle } = this.props;

    if (alliance) {
      setTitle(__("Alliance") + ": " + alliance.name);
    }
  }

  render(): JSX.Element {
    const {
      alliance,
      isAdmin,
      isMember,
      requests,
      canJoin,
      updateRequest,
      hasPendingRequest,
      userId
    } = this.props;

    if (!alliance) {
      return <Loading />;
    }

    return (
      <GridRow>
        <GridColumn className="col-xs-12">
          {/* <Well>{alliance && alliance.description}</Well> */}

          <Section>{__("Members")}</Section>
          <ul>
            {alliance &&
              alliance.members &&
              alliance.members.map(member => (
                <li key={member.id}>
                  {member.name}
                  {isAdmin && member.id !== userId && (
                    <span>
                      <Button
                        bsSize="xsmall"
                        bsStyle="link"
                        title={__("Remove user from alliance")}
                      >
                        {__("Remove")}
                      </Button>
                      {!alliance.admins.some(a => a.id === member.id) ? (
                        <Button bsSize="xsmall" bsStyle="link">
                          {__("Make admin")}
                        </Button>
                      ) : (
                        <Button bsSize="xsmall" bsStyle="link">
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
              alliance.admins.map(admin => (
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
                    onSubmit={(formState: IFormState, options) => {
                      return requestJoin(
                        {
                          allianceId: alliance.id,
                          reason: formState.getFieldValue("reason")
                        },
                        options
                      );
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
                          disabled={!formState.getFieldValue("reason")}
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
                  {__("You have a pending request to join this alliance")}
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
                  onSubmit={(formState: IFormState, options) => {
                    return leave(alliance.id, options);
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
                  {requests.map(request => {
                    return (
                      <li key={request.id}>
                        {HumanDate(request.createdAt)} -{" "}
                        {request.requestedByUser.name} - {request.reason} -{" "}
                        {request.state} - {HumanDate(request.lastModifiedAt)}
                        {request.state === AllianceJoinRequestState.Active && (
                          <span>
                            <Button
                              bsSize="xsmall"
                              bsStyle="link"
                              onClick={() => {
                                updateRequest(
                                  alliance.id,
                                  request.id,
                                  AllianceJoinRequestState.Approved
                                );
                              }}
                            >
                              {__("Approve")}
                            </Button>
                            <Button
                              bsSize="xsmall"
                              bsStyle="link"
                              onClick={() => {
                                updateRequest(
                                  alliance.id,
                                  request.id,
                                  AllianceJoinRequestState.Denied
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
                onSubmit={(formState: IFormState, options) => {
                  return deleteAlliance(alliance.id, options);
                }}
                component={({ isPending, formState }) => (
                  <div>
                    <ControlledCheckBox
                      label={__("Yes, I really want to delete the alliance")}
                      fieldName="confirmDelete"
                      required={true}
                    />

                    <ProgressButton
                      type="submit"
                      bsStyle="primary"
                      disabled={!formState.getFieldValue("confirmDelete")}
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
  }
}

export default connect(
  (state: IState) => {
    const { alliance, requests, pendingRequests } = state.alliances;
    const userInfo = state.session.userInfo;
    const allianceId = userInfo && userInfo.allianceId;
    const allianceAdmin = userInfo && userInfo.allianceAdmin;
    const userId = userInfo && userInfo.userId;

    const notAMemberOfCurrentAlliance =
      alliance && !alliance.members.some(x => x.id === userId);
    const notInAnyAlliance = !allianceId;
    const hasPendingRequest =
      alliance &&
      pendingRequests &&
      pendingRequests.some(
        x =>
          x.allianceId === alliance.id &&
          x.state === AllianceJoinRequestState.Active
      );
    const hasOtherPendingRequest =
      alliance &&
      pendingRequests &&
      pendingRequests.some(
        x =>
          x.allianceId !== alliance.id &&
          x.state === AllianceJoinRequestState.Active
      );
    const isMember = alliance && allianceId && alliance.id === allianceId;

    return {
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
      hasOtherPendingRequest
    };
  },
  dispatch => ({
    setTitle: (title: string) => {
      dispatch(setTitle(title));
    },
    get: (id: string) => {
      dispatch(get(id));
    },
    updateRequest: (
      allianceId: string,
      requestId: string,
      state: AllianceJoinRequestState
    ) => {
      dispatch(
        updateRequest({
          allianceId,
          requestId,
          state
        })
      );
    }
  })
)(AllianceInfoComponent);

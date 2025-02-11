'use strict';
import React, {useState} from "react";
import Cookies from "js-cookie";
import {getInviteUrl} from "./urls";
import ValidationErrors from "../utilities/ValidationErrors";


const InviteWidget = function(props) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);

  const sendInvite = function () {
    let invitationDetails = {
      'team': props.team.id,
      'email': email,
    }
    let params = {
      teamSlug: props.team.slug,
      invitation: invitationDetails,
    };
    props.client.invitationsCreate(params).then((result) => {
        props.addInvitation(result);
        setEmail('')
    }).catch((error) => {
      error.response.json().then((errors) => {
        setErrors(errors.email);
      })
    });
  };

  return (
    <div>
      <h3 className="pg-subtitle">{gettext("Invite Team Members")}</h3>
      <div className="pg-input-group">
        <input className="pg-control" type="email" placeholder="michael@dundermifflin.com"
               onChange={(event)=>setEmail(event.target.value)} value={email}>
        </input>
        <ValidationErrors errors={errors} />
      </div>
      <a className="pg-button-secondary mt-2" onClick={() => sendInvite()}>
        <span className="pg-icon">
          <i className="fa fa-envelope-o"></i>
        </span>
        <span>{gettext("Invite")}</span>
      </a>
    </div>
  );
};

const InvitationTableRow = function(props) {
  const controls = props.canManageInvitations ? (
    <div className="pg-inline-buttons pg-justify-content-end">
      <a className="pg-button-secondary" onClick={() => props.resendInvitation(props.index)}>
        <span>{ props.sent ? gettext("Sent!") : gettext("Resend Invitation") }</span>
      </a>
      <a className="pg-button-secondary mx-2" onClick={() => props.delete(props.index)}>
        <span>{gettext("Cancel Invitation")}</span>
      </a>
    </div>
  ) : '';
  return (
    <tr>
      <td>{props.email}</td>
      <td>{props.role}</td>
      <td>
        {controls}
      </td>
    </tr>
  );
};


export const InvitationList = function(props) {
  const [invitations, _setInvitations] = useState(props.team.invitations);

  const setInvitations = function(newInvitations) {
    // have to copy the invitations array because state comparisons are shallow
    // https://stackoverflow.com/a/59690997/8207
    _setInvitations([...newInvitations])
  };

  const addInvitation = function(invitation) {
    invitations.push(invitation);
    setInvitations(invitations);
  };

  const deleteInvitation = function(index) {
    const params = {
        id: invitations[index].id,
        teamSlug: props.team.slug,
    };
    props.client.invitationsDestroy(params).then((result) => {
      invitations.splice(index, 1);
      setInvitations(invitations);
    });
  };

  const resendInvitation = function(index) {
    const inviteUrl = getInviteUrl(
      props.apiUrls['single_team:resend_invitation'],
      props.team.slug,
      invitations[index].id
    );
    fetch(inviteUrl, {
      method: "POST",
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    }).then((response) => {
      if (response.ok) {
        invitations[index].sent = true;
        setInvitations(invitations);
      }
    });
  };

  const renderPendingInvitations = function () {
    if (invitations.length === 0) {
      return (
        <p className="my-2 has-text-grey text-muted">
          {gettext("Any pending invitations will show up here until accepted.")}
        </p>
      );
    }
    return (
      <div>
        <br/>
        <h3 className='pg-subtitle'>{gettext("Pending Invitations")}</h3>
        <div className='table-responsive'>
          <table className="table pg-table">
            <thead>
            <tr>
              <th>{gettext("Email")}</th>
              <th>{gettext("Role")}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {
              invitations.map((invitation, index) => {
                return <InvitationTableRow key={invitation.id} index={index} {...invitation}
                                           delete={(index) => deleteInvitation(index)}
                                           resendInvitation={(index) => resendInvitation(index)}
                                           canManageInvitations={props.canManageInvitations}
                />;
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section className="app-card">
      {props.canManageInvitations ? (
        <InviteWidget team={props.team} client={props.client} addInvitation={addInvitation}/>
      ) : ''}
      {renderPendingInvitations()}
    </section>
  );
};

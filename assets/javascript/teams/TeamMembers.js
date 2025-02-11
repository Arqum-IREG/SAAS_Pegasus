'use strict';
import React from "react";
import {getMembershipUrl} from "./urls";


const TeamMemberTableRow = function(props) {

  const getMemberDisplay = function() {
    // admins can edit anyone. non-admins can edit themselves.
    if (props.team?.isAdmin || props.userId === props.actingUser.id) {
      const membershipUrl = getMembershipUrl(
        props.apiUrls['single_team:team_membership_details'],
        props.team.slug,
        props.id,
      );
      return <a className={'link'} href={membershipUrl}>{props.displayName}</a>
    } else {
      return props.displayName;
    }
  }

  return (
    <tr>
      <td>
        {getMemberDisplay()}
      </td>
      <td>{props.role}</td>
    </tr>
  );
};

export const TeamMemberList = function (props) {
  return (
    <section className="app-card">
      <h3 className="pg-subtitle">{gettext("Team Members")}</h3>
      <div className='table-responsive'>
        <table className="table pg-table">
          <thead>
          <tr>
            <th>{gettext("Member")}</th>
            <th>{gettext("Role")}</th>
          </tr>
          </thead>
          <tbody>
          {
            props.members.map((membership, index) => {
              return <TeamMemberTableRow key={membership.id} index={index} apiUrls={props.apiUrls} team={props.team} actingUser={props.user} {...membership} />;
            })
          }
          </tbody>
        </table>
      </div>
    </section>
  );
};

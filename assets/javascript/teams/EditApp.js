'use strict';
import React, {useState} from "react";
import TeamDetails from "./TeamDetails";
import {getTeamUrl} from "./urls";


const EditTeamApplication = function(props) {
  const [team, setTeam] = useState(props.team);
  const [recentlySaved, setRecentlySaved] = useState(false);
  const [errors, setErrors] = useState({});

  const saveTeam = function(team, name, slug) {
    const params = {
      id: team.id,
      patchedTeam: {
        name: name,
        slug: slug,
      }
    };
    props.client.teamsPartialUpdate(params).then((result) => {
      const slugChanged = team.slug !== result.slug;
      if (slugChanged) {
        // if the slug changed we need to do a full-page refresh,
        // because all the links (including navigation) have changed
        const teamUrl = getTeamUrl(
          props.apiUrls['single_team:manage_team'],
          result.slug
        );
        window.location = teamUrl;
      }
      else {
        setTeam(result);
        setRecentlySaved(true);
        setTimeout(() => setRecentlySaved(false), 3000);
      }
    }).catch((error) => {
      error.response.json().then((errors) => {
        setErrors(errors);
      })
    });
  };

  const deleteTeam = function(team) {
    let params = {id: team.id}
    props.client.teamsDestroy(params).then((result) => {
      window.location = '/';
    }).catch((error) => {
      error.response.json().then((errors) => {
        setErrors(errors);
      })
    });
  };

  return (
    <TeamDetails
      save={saveTeam}
      delete={deleteTeam}
      returnUrl={null}
      recentlySaved={recentlySaved}
      errors={errors}
      {...props}
    />
  );
};

export default EditTeamApplication;

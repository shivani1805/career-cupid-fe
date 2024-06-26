import { Avatar, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import * as recruiterClient from "../../recruiters/client";
import * as userClient from "../../users/client";

export default function RecruiterList() {
  let [recruiters, setRecruiters] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let recruiters = await recruiterClient.getRecruitersByFilter();
      let userIds = recruiters.map((recruiter) => recruiter.user);
      let users = await userClient.getUsersByFilter(
        new URLSearchParams(`userIds=${userIds.join(",")}`)
      );
      let userMap = {};
      users.forEach((user) => (userMap[user._id] = user));
      let recruiterList = recruiters.map((recruiter) => {
        let user = userMap[recruiter.user];
        delete user._id;
        return { ...recruiter, ...user };
      });
      setRecruiters(recruiterList);
    })();
  }, []);

  const onSearchHandler = async (keyword) => {
    let recruiters = await recruiterClient.getRecruitersByFilter(
      new URLSearchParams(`keyword=${keyword}`)
    );
    let userIds = recruiters.map((recruiter) => recruiter.user);
    let users = await userClient.getUsersByFilter(
      new URLSearchParams(`userIds=${userIds.join(",")}`)
    );
    let userMap = {};
    users.forEach((user) => (userMap[user._id] = user));
    let recruiterList = recruiters.map((recruiter) => {
      let user = userMap[recruiter.user];
      delete user._id;
      return { ...recruiter, ...user };
    });
    setRecruiters(recruiterList);
  };

  const onApprove = async (recruiter) => {
    let updatedRecruiter = await recruiterClient.approveRecruiter(recruiter._id);
    if (updatedRecruiter) {
      let users = await userClient.getUsersByFilter(
        new URLSearchParams(`userIds=${updatedRecruiter.user}`)
      );
      let user = users[0];
      delete user._id;
      updatedRecruiter = { ...updatedRecruiter, ...user };
      let updatedRecruiters = recruiters.map((recruiter) => {
        return recruiter._id === updatedRecruiter._id ? updatedRecruiter : recruiter;
      });
      setRecruiters(updatedRecruiters);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Recruiters</h2>
      <div className="col-md-12">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, company, location, website"
          onChange={(e) => onSearchHandler(e.target.value)}
        />
      </div>
      <br />
      <div className="row">
        {recruiters && recruiters.length > 0 ? (
          recruiters.map((recruiter, index) => (
            <div key={index} className="col-md-6 mb-4">
              <RecruiterProfile recruiter={recruiter} onApprove={onApprove} />
            </div>
          ))
        ) : (
          <div>No recruiters found</div>
        )}
      </div>
    </div>
  );
}

const RecruiterProfile = ({ recruiter, onApprove }) => {
  return (
    <Card sx={{ marginBottom: 2, height: "100%" }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <Avatar src={recruiter.profile_picture} alt={recruiter.email} />
          <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
            {recruiter.firstname}&nbsp;{recruiter.lastname}
          </Typography>
        </div>
        <Typography variant="body1" gutterBottom>
          <b>Email:</b> {recruiter.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>Company:</b> {recruiter.company}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>Location:</b> {recruiter.city}, {recruiter.state}, {recruiter.country}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>Website:</b> {recruiter.website}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>Bio:</b> {recruiter.bio}
        </Typography>
        {recruiter.approved ? (
          <button className="btn btn-danger" disabled>
            Approved
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => onApprove(recruiter)}>
            Approve
          </button>
        )}
      </CardContent>
    </Card>
  );
};
